import { sendEmail } from "./sendEmail.js";
import twilio from 'twilio';
import ErrorHandler from "../middlewares/error.handler.js";

export const sendVerificationCode = async (verificationMethod, email, phone, verificationCode) => {
    // Validate method BEFORE try/catch so it throws correctly
    if (!['email', 'phone'].includes(verificationMethod)) {
        throw new ErrorHandler("Invalid verification method", 400);
    }

    try {
        if (verificationMethod === 'email') {
            const emailTemplate = generateEmailTemplate(verificationCode);
            await sendEmail({ email, subject: "Verify Your Email", message: emailTemplate });

        } else if (verificationMethod === 'phone') {
            // Create client lazily inside function so env vars are guaranteed loaded
            const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

            const verificationCodeChunks = verificationCode.split("").join(" ");

            // fixed: added await so Twilio errors are caught
            await client.calls.create({
                twiml: `<Response><Say>Your verification code is ${verificationCodeChunks}. Repeat. ${verificationCodeChunks}</Say></Response>`,
                to: phone,
                from: process.env.TWILIO_PHONE_NUMBER,
            });
        }
    } catch (error) {
        throw new ErrorHandler(`Failed to send verification code: ${error.message}`, 500);
    }
};


// email template
function generateEmailTemplate(verificationCode) {
    return `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
    
    <h2 style="margin-bottom: 10px;">🔐 Verify Your Email</h2>
    
    <p style="color: #555; font-size: 14px;">
      Use the verification code below:
    </p>

    <div
      style="
        margin: 20px auto;
        padding: 12px 20px;
        font-size: 24px;
        letter-spacing: 5px;
        font-weight: bold;
        color: #111;
        background: rgba(0,0,0,0.05);
        border-radius: 10px;
        display: inline-block;
      "
    >
      ${verificationCode}
    </div>

    <p style="color: #777; font-size: 13px;">
      This code expires in 10 minutes.
    </p>

  </div>
    `;
};