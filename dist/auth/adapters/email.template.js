"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplate = void 0;
exports.emailTemplate = {
  registrationEmail: (code) => {
    return `<h1>Thank for your registration</h1>
                 <p>To finish registration please follow the link below:
                     <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
                 </p>`;
  },
  recoveryPasswordEmail: (code) => {
    return `
            <h1>Password recovery</h1>
            <p>To finish password recovery please follow the link below:
              <a href="https://somesite.com/password-recovery?recoveryCode=${code}">recovery password</a>
            </p>`;
  },
};
//# sourceMappingURL=email.template.js.map
