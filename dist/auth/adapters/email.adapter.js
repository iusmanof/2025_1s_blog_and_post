"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAdapterRecoveryPassword = exports.EmailAdapterYandex = exports.EmailAdapter = void 0;
const inversify_1 = require("inversify");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let EmailAdapter = class EmailAdapter {
    nodemailer(email, emailTemplate) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "igralex1@gmail.com",
                    pass: "whrdvnebtxxpibbx",
                },
            });
            yield (() => __awaiter(this, void 0, void 0, function* () {
                yield transporter.sendMail({
                    from: `"Sprint 2 " <igralex1@gmail.com>`,
                    to: email,
                    subject: "Hello user",
                    html: emailTemplate,
                });
            }))();
        });
    }
};
exports.EmailAdapter = EmailAdapter;
exports.EmailAdapter = EmailAdapter = __decorate([
    (0, inversify_1.injectable)()
], EmailAdapter);
class EmailAdapterYandex {
    nodemailer(email, emailTemplate) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                host: "smtp.yandex.ru",
                port: 465,
                secure: true,
                auth: {
                    user: "iewfu@yandex.by",
                    pass: "jsrcvqgwmqtaqqot",
                },
                tls: {
                    rejectUnauthorized: false,
                }
            });
            yield (() => __awaiter(this, void 0, void 0, function* () {
                yield transporter.sendMail({
                    from: `"Week 3 Sprint 2 " <iewfu@yandex.by>`,
                    to: email,
                    subject: "Hello samurai",
                    html: emailTemplate,
                });
            }))();
        });
    }
}
exports.EmailAdapterYandex = EmailAdapterYandex;
let EmailAdapterRecoveryPassword = class EmailAdapterRecoveryPassword {
    nodemailer(email, emailTemplate) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: false,
                auth: null
            });
            yield transporter.sendMail({
                from: "Test <no-reply@test.com>",
                to: email,
                subject: "Password recovery",
                html: emailTemplate,
            });
        });
    }
};
exports.EmailAdapterRecoveryPassword = EmailAdapterRecoveryPassword;
exports.EmailAdapterRecoveryPassword = EmailAdapterRecoveryPassword = __decorate([
    (0, inversify_1.injectable)()
], EmailAdapterRecoveryPassword);
//# sourceMappingURL=email.adapter.js.map