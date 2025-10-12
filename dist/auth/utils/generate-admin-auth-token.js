"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminAuthToken = generateAdminAuthToken;
const super_admin_guard_middleware_1 = require("../middlewares/super-admin.guard-middleware");
function generateAdminAuthToken() {
    const credentials = `${super_admin_guard_middleware_1.ADMIN_USERNAME}:${super_admin_guard_middleware_1.ADMIN_PASSWORD}`;
    const base64Credentials = Buffer.from(credentials).toString("base64");
    return `Basic ${base64Credentials}`;
}
//# sourceMappingURL=generate-admin-auth-token.js.map