import { injectable } from "inversify";
import * as jwt from "jsonwebtoken";
import { SETTINGS } from "../../../core/db/settings";

@injectable()
export class JwtAdapter {
  async signAccessToken(id: string) {
    return jwt.sign({ id }, SETTINGS.ACCESS_TOKEN_SECRET, {
      expiresIn: SETTINGS.ACCESS_TOKEN_SECRET_TIME,
    });
  }
  async decodeToken(token: string) {
    return jwt.decode(token) as {
      exp: number;
      iat: number;
      id: string;
      userAgent: string;
      ipAddr: string;
      deviceId: string;
    };
  }
  async parseJwtPayloadIat(
    token: string,
  ): Promise<{ id: string; iat: number; exp: number }> {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  }
  async verifyAccessToken(token: string) {
    return jwt.verify(token, SETTINGS.ACCESS_TOKEN_SECRET);
  }
  async verifyRefreshToken(token: string) {
    return jwt.verify(token, SETTINGS.REFRESH_TOKEN_SECRET);
  }
  async signRefreshToken(
    id: string,
    ipAddr: string,
    userAgent: string,
    deviceId: string,
  ): Promise<any> {
    return jwt.sign(
      { id, ipAddr, userAgent, deviceId },
      SETTINGS.REFRESH_TOKEN_SECRET,
      {
        expiresIn: SETTINGS.REFRESH_TOKEN_SECRET_TIME,
      },
    );
  }
}
