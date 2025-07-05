const { createTransport } = require("nodemailer");

// Function to configure SMTP server email transport settings
function getTransporter(bussinessEmailPassword) {
    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.BUSSINESS_EMAIL,
            pass: bussinessEmailPassword,
        },
        tls: {
            ciphers: "SSLv3",
        },
    });
    return transporter;
}

module.exports = {
    getTransporter
}