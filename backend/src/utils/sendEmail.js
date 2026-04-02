import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_MAIL,       // fixed: was SMTP_USER (undefined)
                pass: process.env.SMTP_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.SMTP_MAIL,           // fixed: was SMTP_USER (undefined)
            to: email,
            subject,
            html: message,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");

    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // fixed: re-throw so caller knows email failed
    }
}