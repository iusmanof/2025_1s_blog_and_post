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
exports.UserMongooseModel = exports.passwordRecoverySchema = exports.emailConfirmationSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.emailConfirmationSchema = new mongoose_1.default.Schema({
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true, default: false },
}, { _id: false });
exports.passwordRecoverySchema = new mongoose_1.default.Schema({
    recoveryCode: { type: String },
    expirationDate: { type: Date },
}, { _id: false });
const userSchema = new mongoose_1.default.Schema({
    login: { type: String, required: true },
    email: {
        type: String,
        required: true,
        match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        unique: true,
    },
    password: { type: String, required: true },
    // For a small project, emailConfirmation and passwordRecovery can be embedded in the user schema.
    // For a large project, create separate mongoose.Schema models for them.
    emailConfirmation: { type: exports.emailConfirmationSchema, required: false },
    passwordRecovery: { type: exports.passwordRecoverySchema, required: false },
}, { timestamps: true });
exports.UserMongooseModel = (0, mongoose_1.model)("user", userSchema);
//# sourceMappingURL=user.entity.js.map