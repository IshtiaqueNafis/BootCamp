const nodemailer = require("nodemailer");
// this from nodemailer package.

const sendEmail = async (options) => {
    // options will be a ojbect


    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, // host for the email
        port: process.env.SMTP_PORT, // port for the process
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // send mail with defined transport object
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}> `,
        to: options.email, // this comes from options
        subject: options.subject,
        text: options.message,

    };

    const info = await transporter.sendMail(message)


};

module.exports = sendEmail;