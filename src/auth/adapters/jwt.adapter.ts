import * as jwt from 'jsonwebtoken';
import {JwtPayload} from 'jsonwebtoken';
import {SETTINGS} from "../../core/settings/settings";

export const jwtAdapter = {
    async signAccessToken(id: string) {
        return jwt.sign({id}, SETTINGS.ACCESS_TOKEN_SECRET, {
            expiresIn: SETTINGS.ACCESS_TOKEN_SECRET_TIME,
        });
    },
    async decodeToken(token: string): Promise<string | { exp: number } | JwtPayload | null> {
        return jwt.decode(token)
    },
    async verifyAccessToken(token: string) {
        return jwt.verify(token, SETTINGS.ACCESS_TOKEN_SECRET);
    },
    async signRefreshToken(id: string) {
        return jwt.sign({id}, SETTINGS.REFRESH_TOKEN_SECRET, {
            expiresIn: SETTINGS.REFRESH_TOKEN_SECRET_TIME,
        });
    }
}