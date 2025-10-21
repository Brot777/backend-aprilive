import nodemailer from "nodemailer";

export const emailData = {
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
};

export const smtpData = {
  host: process.env.SMTP_HOST || "",
  port: Number(process.env.SMTP_HOST) || 0,
};

// Create a test account or replace with real credentials.
export const transporter = nodemailer.createTransport({
  host: smtpData.host,
  port: smtpData.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: emailData.user,
    pass: emailData.password,
  },
});
