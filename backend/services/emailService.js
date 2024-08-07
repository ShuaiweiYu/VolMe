import emailjs from '@emailjs/nodejs'

export const sendCodeEmail = (params) => {
    return emailjs.send(process.env.EMAIL_SERVICEID, "send_code", params, {
        publicKey: process.env.EMAIL_PUBLIC,
        privateKey: process.env.EMAIL_PRIVATE});
};

export const sendEmail = (params) => {
    return emailjs.send(process.env.EMAIL_SERVICEID, "generic_template", params, {
        publicKey: process.env.EMAIL_PUBLIC,
        privateKey: process.env.EMAIL_PRIVATE});
};