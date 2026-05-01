import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: { 
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS 
  },
});

async function test() {
  console.log("Testing email connection...");
  console.log("Using User:", process.env.SMTP_USER);
  
  try {
    // Verify connection configuration
    await transporter.verify();
    console.log("✅ Connection verified successfully!");

    // Send test mail
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // send to self
      subject: "Test Email from EMS",
      text: "If you see this, your email configuration is working!",
      html: "<b>If you see this, your email configuration is working!</b>",
    });

    console.log("✅ Message sent: %s", info.messageId);
  } catch (error) {
    console.error("❌ Email failed:", error);
  }
}

test();
