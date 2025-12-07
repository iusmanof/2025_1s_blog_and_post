import { inject, injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { ResultObject, resultStatus } from "../../core/types/result-object";
import { User } from "../../users/types/user";
import { emailTemplate } from "../adapters/email.template";
import { JwtAdapter } from "../adapters/jwt.adapter";
import { SecurityDevicesService } from "./security-devices.service";
import {
  EmailAdapter,
  EmailAdapterRecoveryPassword,
  EmailAdapterYandex,
} from "../adapters/email.adapter";
import { BcryptAdapter } from "../adapters/bcrypt.adapter";
import { UsersRepository } from "../../users/repositories/users.repository";
import { SecurityDevicesQueryRepository } from "../repositories/security-devices.query-repository";
import { SecurityDevicesRepository } from "../repositories/security-devices.repository";
import { UsersQueryRepository } from "../../users/repositories/users.query.repository";

@injectable()
export class AuthService {
  constructor(
    @inject(JwtAdapter) private readonly jwtAdapter: JwtAdapter,
    @inject(EmailAdapter) private readonly emailAdapter: EmailAdapter,
    @inject(EmailAdapterRecoveryPassword)
    private readonly emailAdapterRecoveryPassword: EmailAdapterRecoveryPassword,
    @inject(EmailAdapterYandex)
    private readonly emailAdapterYandex: EmailAdapterYandex,
    @inject(BcryptAdapter) private readonly bcryptAdapter: BcryptAdapter,
    @inject(SecurityDevicesService)
    private readonly securityDevicesService: SecurityDevicesService,
    @inject(SecurityDevicesQueryRepository)
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
    @inject(SecurityDevicesRepository)
    private readonly securityDevicesRepository: SecurityDevicesRepository,
    @inject(UsersQueryRepository)
    private readonly usersQueryRepository: UsersQueryRepository,
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  async login(
    loginOrEmail: string,
    password: string,
    ipAddr: string,
    userAgent: string,
  ): Promise<
    ResultObject<{
      accessToken: string;
      refreshToken: string;
    } | null>
  > {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      return {
        status: resultStatus.ERROR,
        errorMessages: "Unauthorized",
        extensions: [{ message: "Not found", field: "loginOrEmail" }],
        data: null,
      };
    }

    const passwordCorrect = await this.bcryptAdapter.checkPassword(
      password,
      user.password,
    );
    if (!passwordCorrect) {
      return {
        status: resultStatus.ERROR,
        errorMessages: "Bad request",
        extensions: [{ message: "Wrong password", field: "password" }],
        data: null,
      };
    }

    const accessToken = await this.jwtAdapter.signAccessToken(
      user._id.toString(),
    );

    const deviceId = uuidv4();
    const refreshToken = await this.jwtAdapter.signRefreshToken(
      user._id.toString(),
      ipAddr,
      userAgent,
      deviceId,
    );

    const {
      id: payloadId,
      iat: payloadIat,
      exp: payloadExp,
    } = await this.jwtAdapter.parseJwtPayloadIat(refreshToken);
    const securityDeviceDTO = {
      userId: payloadId,
      title: userAgent,
      ip: ipAddr,
      expiryDate: payloadExp,
      lastActivateDate: payloadIat,
      deviceId: deviceId,
    };
    await this.securityDevicesService.setDevice(securityDeviceDTO);

    return {
      status: resultStatus.SUCCESS,
      data: { accessToken, refreshToken },
      extensions: [],
    };
  }

  async registerUser(
    login: string,
    email: string,
    password: string,
  ): Promise<ResultObject<User | null | string>> {
    const passwordHash = await this.bcryptAdapter.generateHash(password);
    const newUser: User = {
      login: login,
      email: email,
      password: passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
        isConfirmed: false,
      },
      passwordRecovery: null,
    };
    await this.usersRepository.create(newUser);

    if (newUser.emailConfirmation) {
      try {
        await this.emailAdapter.nodemailer(
          email,
          emailTemplate.registrationEmail(
            newUser.emailConfirmation.confirmationCode,
          ),
        );
      } catch (err) {
        console.log("send email error");
      }
    }
    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: "code send",
    };
  }

  async confirmUser(code: string): Promise<ResultObject<User | null>> {
    const user = await this.usersRepository.findByConfirmationCode(code);

    if (!user) {
      return {
        status: resultStatus.BAD_REQUEST,
        errorMessages: "Bad request",
        extensions: [{ message: "Invalid code", field: "code" }],
        data: null,
      };
    }

    if (user.emailConfirmation.isConfirmed) {
      return {
        status: resultStatus.BAD_REQUEST,
        errorMessages: "Bad request",
        extensions: [{ message: "Code already confirmed", field: "code" }],
        data: null,
      };
    }

    if (user.emailConfirmation.expirationDate! < new Date()) {
      return {
        status: resultStatus.CODE_EXPIRED,
        errorMessages: "Bad request",
        extensions: [{ message: "Code expired", field: "code" }],
        data: null,
      };
    }

    await this.usersRepository.confirmCode(code);

    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: user,
    };
  }

  async resendCode(email: string): Promise<ResultObject<User | null | string>> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return {
        status: resultStatus.NOT_FOUND,
        errorMessages: "Email not found",
        extensions: [{ message: "Email not exists", field: "email" }],
        data: null,
      };
    }
    if (user.emailConfirmation.isConfirmed) {
      return {
        status: resultStatus.BAD_REQUEST,
        errorMessages: "Bad request",
        extensions: [{ message: "Email is already confirmed", field: "email" }],
        data: null,
      };
    }

    const codeRefreshed: string = randomUUID();
    await this.usersRepository.findBYEmailAndRefreshCode(email, codeRefreshed);

    try {
      await this.emailAdapter.nodemailer(
        email,
        emailTemplate.registrationEmail(codeRefreshed),
      );
    } catch (err) {
      console.log("send email error");
    }

    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: null,
    };
  }

  async updateToken(
    rf: string,
    ipAddr: string,
    userAgent: string,
  ): Promise<ResultObject<{} | null>> {
    const decoded = await this.jwtAdapter.decodeToken(rf);

    const oldDevice = await this.securityDevicesQueryRepository.findByIdAndIat(
      decoded.deviceId,
      decoded.iat,
    );
    if (!oldDevice) {
      return {
        status: resultStatus.UNAUTHORIZED,
        data: null,
        errorMessages: "Refresh Token",
        extensions: [
          {
            message: "refresh token expired or invalid",
            field: "refresh token",
          },
        ],
      };
    }

    const accessToken = await this.jwtAdapter.signAccessToken(
      decoded.id.toString(),
    );
    const refreshToken = await this.jwtAdapter.signRefreshToken(
      decoded.id.toString(),
      ipAddr,
      userAgent,
      decoded.deviceId,
    );
    const { iat: newIat, exp: newExp } =
      await this.jwtAdapter.parseJwtPayloadIat(refreshToken);

    await this.securityDevicesRepository.updateDevice(decoded.deviceId, {
      lastActivateDate: newIat,
      ip: ipAddr,
      title: userAgent,
      expiryDate: newExp,
    });

    return {
      status: resultStatus.SUCCESS,
      data: { accessToken, refreshToken },
      extensions: [],
    };
  }

  async expireToken(rftoken: string): Promise<ResultObject<string | null>> {
    const decoded = await this.jwtAdapter.decodeToken(rftoken);

    const oldDevice = await this.securityDevicesQueryRepository.findByIdAndIat(
      decoded.deviceId,
      decoded.iat,
    );
    if (!oldDevice) {
      return {
        status: resultStatus.UNAUTHORIZED,
        data: null,
        errorMessages: "Refresh Token",
        extensions: [
          {
            message: "refresh token expired or invalid",
            field: "refresh token",
          },
        ],
      };
    }

    const { count } = await this.securityDevicesRepository.deleteDevice(
      decoded.deviceId,
    );
    if (count === 0) {
      return {
        status: resultStatus.UNAUTHORIZED,
        data: null,
        extensions: [],
      };
    }

    return {
      status: resultStatus.SUCCESS,
      data: null,
      extensions: [],
    };
  }

  async getMe(
    userId: string,
  ): Promise<{ login: string; email: string; userId: string } | null> {
    const result = await this.usersQueryRepository.findById(userId);

    if (!result) return null;

    return {
      login: result.login,
      email: result.email,
      userId: result.id,
    };
  }

  async passwordRecovery(email: string) {
    const checkEmail = await this.usersRepository.findByEmail(email);
    const recovery_code = randomUUID();

    if (checkEmail) {
      try {
        await this.emailAdapterYandex.nodemailer(
          email,
          emailTemplate.recoveryPasswordEmail(recovery_code),
        );
      } catch (err) {
        console.log("send email error", err);
      }

      await this.usersRepository.setRecoveryCode(email, recovery_code);

      return recovery_code;
    }

    return null;
  }

  async confirmPasswordRecovery(newPassword: string, recoveryCode: string) {
    const user = await this.usersRepository.findByRecoveryCode(recoveryCode);
    if (!user || !user.passwordRecovery) return false;

    if (user.passwordRecovery.expirationDate < new Date()) {
      return false;
    }

    const hashedPassword = await this.bcryptAdapter.generateHash(newPassword);

    await this.usersRepository.updatePasswordByRecoveryCode(
      recoveryCode,
      hashedPassword,
    );

    return true;
  }
}
