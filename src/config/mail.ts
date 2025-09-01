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

export const getTemplateRestartPassword = (
  name: string,
  token: string
) => `  <head>
            <link rel="stylesheet" href="./style.css">
        </head>
        
        <div id="email___content">
            <img src="https://i.imgur.com/eboNR82.png" alt="">
            <h2>Hola ${name}</h2>
            <p>Para restablecer tu contraseña, ingresa al siguiente enlace</p>
            <a
                href="${process.env.HOST}/api/users/change-password/${token}"
                target="_blank"
            >Restablecer Contraseña</a>
        </div>
      `;
