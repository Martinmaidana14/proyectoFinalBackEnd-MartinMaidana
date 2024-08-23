
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'martintesting14@gmail.com',
        // La contraseña se tiene que crear en Gmail - "Contraseña de Aplicaciones"
        pass: 'madi srkz amxb ohuq',    

    },
});

export const sendEmailChangePassword = async (email, linkChangePassword) => {
    const mailOption = {
        from: 'martintesting14@gmail.com',
        to: email,
        subject: 'Restablecer password',
        // Cuerpo del mail
        html: 
        `
            <p>Haz click aqui para cambiar tu contraseña: </p> <button> <a href=${linkChangePassword}>Cambiar contraseña</a></button>
        `
    };

    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            console.log('Error al enviar email para cambio de contraseña');
        } else {
            console.log('Correo enviado correctamente', info.response);
        }
    });
};