import * as jwt from 'jsonwebtoken';
import {SETTINGS} from "../../core/settings/settings";

export const jwtAdapter = {
    async signToken(id: string) {
        return jwt.sign({id}, SETTINGS.ACCESS_TOKEN_SECRET, {
            expiresIn: SETTINGS.ACCESS_TOKEN_SECRET_TIME,
        });
    },
    // async decodeToken (token: string) {
    //     return "decodeToken"
    // },
    async verifyToken(token: string) {
        try {
            return jwt.verify(token, SETTINGS.ACCESS_TOKEN_SECRET);
        } catch (err) {
            console.log(err);
            return null
        }
    }
}