export const getTemplateRestartPassword = (
  name: string,
  token: string
) => `  <head>
            <link rel="stylesheet" href="./style.css">
        </head>
        
        <div id="email___content">
            <img src="https://uploads-aprilive.s3.us-east-1.amazonaws.com/defaults/b4700307-8c2b-4bee-ba49-26dbd8302320_logo.jpeg" alt="Aprilive" width="180">
            <h2>Hola ${name}</h2>
            <p>Para restablecer tu contraseña, ingresa al siguiente enlace.</p>
            <a
                href="${process.env.HOST}/api/users/change-password/${token}"
                target="_blank"
            >Restablecer Contraseña</a>
        </div>
      `;

export const getTemplateVerifyEmail = (name: string, token: string) => `  <head>
            <link rel="stylesheet" href="./style.css">
        </head>
        
        <div id="email___content">
            <img src="https://uploads-aprilive.s3.us-east-1.amazonaws.com/defaults/b4700307-8c2b-4bee-ba49-26dbd8302320_logo.jpeg" alt="Aprilive" width="180">
            <h2>Hola ${name}</h2>
            <p>Verifica tu cuenta, ingresa al siguiente enlace.</p>
            <a
                href="${process.env.HOST}/api/users/change-password/${token}"
                target="_blank"
            >Verificar Cuenta</a>
        </div>
      `;
