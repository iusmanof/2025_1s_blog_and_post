import {ADMIN_PASSWORD, ADMIN_USERNAME} from "../middlewares/super-admin.guard-middleware";



export function generateAdminAuthToken(){
    const credentials = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;
    const base64Credentials = Buffer.from(credentials).toString(
        "base64",
    );
    return `Basic ${base64Credentials}`;
}