const nodemailer = require('nodemailer');

// Use environment variables for production, or a mock ethereal account for development
const createTransporter = async () => {
    if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback for development/demo: Ethereal Email
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
};

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = await createTransporter();
        const info = await transporter.sendMail({
            from: '"FleetFlow Alerts" <alerts@fleetflow.com>',
            to,
            subject,
            html,
        });

        console.log(`[Email Service] Message sent to ${to}: ${info.messageId}`);
        
        // Print preview URL if using Ethereal
        if (!process.env.SMTP_HOST) {
            console.log(`[Email Service] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
        
        return info;
    } catch (error) {
        console.error('[Email Service] Failed to send email:', error);
        throw error;
    }
};

module.exports = { sendEmail };
