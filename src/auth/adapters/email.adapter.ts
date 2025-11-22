import { injectable } from "inversify";
import nodemailer from "nodemailer";

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
