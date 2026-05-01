import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, 
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});


export const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({ 
      from: `"EMS Support" <${process.env.SMTP_USER}>`, 
      to, 
      subject, 
      text, 
      html 
    });
  } catch (err) {
    console.error("Email error:", err.message);
  }
};

