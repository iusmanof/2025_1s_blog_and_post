import { injectable } from "inversify";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

@injectable()
export class EmailAdapter {
  async nodemailer(email: string, emailTemplate: string): Promise<any> {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "igralex1@gmail.com",
        pass: "whrdvnebtxxpibbx",
      },
    });

    await (async () => {
        await transporter.sendMail({
            from: `"Sprint 2 " <igralex1@gmail.com>`,
            to: email,
            subject: "Hello user",
            html: emailTemplate,
        });
    })();
  }
}

export class EmailAdapterYandex {
    async nodemailer(email: string, emailTemplate: string): Promise<any> {
        const transporter = nodemailer.createTransport({
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

        await (async () => {
            await transporter.sendMail({
                from: `"Week 3 Sprint 2 " <iewfu@yandex.by>`,
                to: email,
                subject: "Hello samurai",
                html: emailTemplate,
            });
        })();
    }
}

@injectable()
export class EmailAdapterRecoveryPassword {
    async nodemailer(email: string, emailTemplate: string): Promise<void> {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: null
        } as any);

        await transporter.sendMail({
            from: "Test <no-reply@test.com>",
            to: email,
            subject: "Password recovery",
            html: emailTemplate,
        });
    }
}
