import nodemailer from "nodemailer";

export const emailData = {
  email: process.env.SMTP_EMAIL,
  password: process.env.SMTP_PASSWORD,
};

// Create a test account or replace with real credentials.
export const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: emailData.email,
    pass: emailData.password,
  },
});
