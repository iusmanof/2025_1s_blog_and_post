import { usersRepository } from "../../users/repositories/users.repository";
import { bcryptAdapter } from "../adapters/bcrypt.adapter";
import { ResultObject, resultStatus } from "../../core/types/result-object";
import { jwtAdapter } from "../adapters/jwt.adapter";
import { randomUUID } from "crypto";
import { emailAdapter } from "../adapters/email.adapter";
import { add } from "date-fns";
import { UserDbDto } from "../../users/types/user-db-dto";
import { emailExampleTemplate } from "../../core/types/email-example.template";
import { usersQueryRepository } from "../../users/repositories/users.query.repository";
import { securityDevicesService } from "./security-devices.service";
import { v4 as uuidv4 } from "uuid";
import { securityDevicesQueryRepository } from "../repository/security-devices.query-repository";
import { securityDevicesRepository } from "../repository/security-devices.repository";

export const authService = {
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
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      return {
        status: resultStatus.ERROR,
        errorMessages: "Unauthorized",
        extensions: [{ message: "Not found", field: "loginOrEmail" }],
        data: null,
      };
    }

    const passwordCorrect = await bcryptAdapter.checkPassword(
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

    const accessToken = await jwtAdapter.signAccessToken(user._id.toString());

    const deviceId = uuidv4();
    const refreshToken = await jwtAdapter.signRefreshToken(
      user._id.toString(),
      ipAddr,
      userAgent,
      deviceId,
    );

    const {
      id: payloadId,
      iat: payloadIat,
      exp: payloadExp,
    } = await jwtAdapter.parseJwtPayloadIat(refreshToken);
    const securityDeviceDTO = {
      userId: payloadId,
      title: userAgent,
      ip: ipAddr,
      expiryDate: payloadExp,
      lastActivateDate: payloadIat,
      deviceId: deviceId,
    };
    await securityDevicesService.setDevice(securityDeviceDTO);

    return {
      status: resultStatus.SUCCESS,
      data: { accessToken, refreshToken },
      extensions: [],
    };
  },
  async registerUser(
    login: string,
    email: string,
    password: string,
  ): Promise<ResultObject<UserDbDto | null | string>> {
    const passwordHash = await bcryptAdapter.generateHash(password);
    const newUser: UserDbDto = {
      login: login,
      email: email,
      password: passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
        isConfirmed: false,
      },
    };
    await usersRepository.create(newUser);

    if (newUser.emailConfirmation) {
      try {
        await emailAdapter.nodemailer(
          email,
          emailExampleTemplate.registrationEmail(
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
  },
  async confirmUser(code: string): Promise<ResultObject<UserDbDto | null>> {
    const user = await usersRepository.findByConfirmationCode(code);

    if (!user) {
      return {
        status: resultStatus.BAD_REQUEST,
        errorMessages: "Bad request",
        extensions: [{ message: "Invalid code", field: "code" }],
        data: null,
      };
    }

    if (user.emailConfirmation!.isConfirmed) {
      return {
        status: resultStatus.BAD_REQUEST,
        errorMessages: "Bad request",
        extensions: [{ message: "Code already confirmed", field: "code" }],
        data: null,
      };
    }

    if (user.emailConfirmation?.expirationDate! < new Date()) {
      return {
        status: resultStatus.CODE_EXPIRED,
        errorMessages: "Bad request",
        extensions: [{ message: "Code expired", field: "code" }],
        data: null,
      };
    }

    await usersRepository.confirmCode(code);

    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: user,
    };
  },
  async resendCode(
    email: string,
  ): Promise<ResultObject<UserDbDto | null | string>> {
    const user = await usersRepository.findByEmail(email);

    if (!user) {
      return {
        status: resultStatus.NOT_FOUND,
        errorMessages: "Email not found",
        extensions: [{ message: "Email not exists", field: "email" }],
        data: null,
      };
    }
    if (user!.emailConfirmation?.isConfirmed) {
      return {
        status: resultStatus.BAD_REQUEST,
        errorMessages: "Bad request",
        extensions: [{ message: "Email is already confirmed", field: "email" }],
        data: null,
      };
    }

    const codeRefreshed: string = randomUUID();
    await usersRepository.findBYEmailAndRefreshCode(email, codeRefreshed);

    try {
      await emailAdapter.nodemailer(
        email,
        emailExampleTemplate.registrationEmail(codeRefreshed),
      );
    } catch (err) {
      console.log("send email error");
    }

    return {
      status: resultStatus.SUCCESS,
      extensions: [],
      data: null,
    };
  },
  async updateToken(
    rf: string,
    ipAddr: string,
    userAgent: string,
  ): Promise<ResultObject<{} | null>> {
    const decoded = await jwtAdapter.decodeToken(rf);

    const oldDevice = await securityDevicesQueryRepository.findByIdAndIat(
      decoded.deviceId,
      decoded.iat,
    );
    if (!oldDevice) {
      return {
        status: resultStatus.UNAUTORIZED,
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

    const accessToken = await jwtAdapter.signAccessToken(decoded.id.toString());
    const refreshToken = await jwtAdapter.signRefreshToken(
      decoded.id.toString(),
      ipAddr,
      userAgent,
      decoded.deviceId,
    );
    const { iat: newIat, exp: newExp } =
      await jwtAdapter.parseJwtPayloadIat(refreshToken);

    await securityDevicesRepository.updateDevice(decoded.deviceId, {
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
  },
  async expireToken(rftoken: string): Promise<ResultObject<string | null>> {
    const decoded = await jwtAdapter.decodeToken(rftoken);

    const oldDevice = await securityDevicesQueryRepository.findByIdAndIat(
      decoded.deviceId,
      decoded.iat,
    );
    if (!oldDevice) {
      return {
        status: resultStatus.UNAUTORIZED,
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

    const { count } = await securityDevicesRepository.deleteDevice(
      decoded.deviceId,
    );
    if (count === 0) {
      return {
        status: resultStatus.UNAUTORIZED,
        data: null,
        extensions: [],
      };
    }

    return {
      status: resultStatus.SUCCESS,
      data: null,
      extensions: [],
    };
  },
  async getMe(
    userId: string,
  ): Promise<{ login: string; email: string; userId: string } | null> {
    const result = await usersQueryRepository.findById(userId);

    if (!result) return null;

    return {
      login: result?.login,
      email: result?.email,
      userId: result?.id,
    };
  },
};
