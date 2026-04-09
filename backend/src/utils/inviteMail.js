import nodemailer from "nodemailer";

export const sendInviteMail = async (email, projectName, inviteLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: `Invitation to join ${projectName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>You have been invited to join a project</h2>
        <p>You have been invited to join <strong>${projectName}</strong>.</p>
        <p>Click the button below to accept the invitation:</p>
        <a 
          href="${inviteLink}" 
          style="
            display:inline-block;
            padding:10px 18px;
            background:#4f46e5;
            color:white;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Accept Invite
        </a>
        <p style="margin-top:20px;">This invite link will expire in 1 day.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};