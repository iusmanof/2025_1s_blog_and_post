"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailExampleTemplate = void 0;
exports.emailExampleTemplate = {
    registrationEmail: (code) => {
        return `<h1>Thank for your registration</h1>
                 <p>To finish registration please follow the link below:
                     <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
                 </p>`;
    },
};
//# sourceMappingURL=email-example.template.js.map