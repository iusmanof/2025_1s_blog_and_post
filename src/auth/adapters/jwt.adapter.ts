import * as jwt from 'jsonwebtoken';
import {SETTINGS} from "../../core/settings/settings";

export const jwtAdapter = {
    async signToken(id: string) {
        return jwt.sign({id}, SETTINGS.ACCESS_TOKEN_SECRET, {
            expiresIn: SETTINGS.ACCESS_TOKEN_SECRET_TIME,
        });
    },
    async decodeToken (token: string) {
        return jwt.decode(token);
    },
    async verifyToken(token: string) {
        return jwt.verify(token, SETTINGS.ACCESS_TOKEN_SECRET);
    }
}