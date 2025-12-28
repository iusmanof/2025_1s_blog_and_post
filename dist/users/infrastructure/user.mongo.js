"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const emailConfirmationSchema = new mongoose_1.default.Schema({
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true, default: false },
}, { _id: false });
const passwordRecoverySchema = new mongoose_1.default.Schema({
    recoveryCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
}, { _id: false });
const userMethods = {
    confirmEmail(confirmationCode) {
        if (this.emailConfirmation &&
            this.emailConfirmation.confirmationCode ===
                confirmationCode) {
            this.emailConfirmation.isConfirmed = true;
            this.emailConfirmation.expirationDate = new Date();
            return true;
        }
        return false;
    },
    initiatePasswordRecovery(recoveryCode, expirationDate) {
        this.passwordRecovery = {
            recoveryCode,
            expirationDate,
        };
    },
    isPasswordRecoveryValid(recoveryCode) {
        const passwordRecovery = this.passwordRecovery;
        if (passwordRecovery) {
            return (passwordRecovery.recoveryCode === recoveryCode &&
                passwordRecovery.expirationDate > new Date());
        }
        return false;
    },
    isEmailConfirmed() {
        var _a, _b;
        return (_b = (_a = this.emailConfirmation) === null || _a === void 0 ? void 0 : _a.isConfirmed) !== null && _b !== void 0 ? _b : false;
    },
};
const userStaticMethods = {
    createUser(login, email, passwordHash) {
        return new exports.UserModel({
            login,
            email,
            passwordHash,
            emailConfirmation: {
                confirmationCode: "",
                expirationDate: new Date(),
                isConfirmed: false,
            },
            passwordRecovery: {
                recoveryCode: "",
                expirationDate: new Date(),
            },
            createdAt: new Date(),
        });
    },
};
const userSchema = new mongoose_1.default.Schema({
    login: { type: String, required: true, maxLength: 15 },
    email: { type: String, required: true, maxLength: 500, unique: true },
    passwordHash: { type: String, required: true, maxLength: 100 },
    emailConfirmation: { type: emailConfirmationSchema, required: false },
    passwordRecovery: { type: passwordRecoverySchema, required: false },
    createdAt: { type: Date, required: true, default: Date.now },
}, {
    timestamps: true,
    optimisticConcurrency: true,
});
userSchema.methods = userMethods;
userSchema.statics = userStaticMethods;
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.mongo.js.map