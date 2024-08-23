
import e from 'express';
import { userModel } from '../models/user.js'
import { sendEmailChangePassword } from '../utils/nodemailer.js';
import jwt from 'jsonwebtoken'
import { createHash, validatePassword } from '../utils/bcrypt.js';

// Login
export const login = async (req, res) => {
    try {
        if (!req.user) { //Si no encontraste usuario
            return res.status(401).send("Usuario o contraseña no validos") //Retorname estado 401 No autorizado (Unauthorized)
        }

        req.session.user = { //Solicitar sesion del usuario
            email: req.user.email,
            first_name: req.user.first_name
        }

        res.status(200).send("Usuario logueado correctamente")

    } catch (e) {
        res.status(500).send("Error al loguear usuario")
    }
}

// Register
export const register = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send("Usuario ya existente en la aplicacion")
        }

        res.status(200).send("Usuario creado correctamente")

    } catch (e) {
        res.status(500).send("Error al registrar usuario")
    }

}

export const sessionGithub = async (req, res) => {
    console.log(req)
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name
    }
    res.redirect('/')

}

export const testJWT = async (req, res) => {
    console.log("Desde testJWT" + req.user)
    if (req.user.rol == 'User')
        res.status(403).send("Usuario no autorizado")
    else
        res.status(200).send(req.user)
}

export const logout = async (req, res) => {
    console.log(req.session)

    const user = await userModel.findOne({ email: req.session.user.email })

    user.last_connection = new Date()
    await user.save()

    req.session.destroy(function (e) {
        if (e) {
            console.log(e)
        } else {
            res.status(200).redirect("/")
        }
    })
}


// Cambiar contraseña
export const changePassword = async(req,res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Hay que quitar la palabra token= y se utiliza un metodo de los array
        const validateToken = jwt.verify(token.substr(6), 'coder');
    
        const user = await userModel.findOne({ email: validateToken.userEmail });

        if (user) {
            if (!validatePassword(newPassword, user.password)) {
                // Contraseña distinta, la hasheo
                const hashPassword = createHash(newPassword);

                // Envio la contraseña hasheada
                user.password = hashPassword;

                // Contraseña hasheada, la guardo
                const resultado = await userModel.findByIdAndUpdate(user._id, user);

                console.log(resultado);

                res.status(200).send('Contraseña modificada correctamente');
            } else {
                // Contraseña iguales
                res.status(400).send('La contraseña no puede ser igual a la anterior');
            }
        } else {
            // El usuario no existe
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        // Si el token no es valido
        if (e?.message == 'jwt expired') {
            res
                .status(400)
                .send(
                    'Paso el tiempo maximo para recuperar la contraseña, enviar otro email para cambiarla'
                );
        }
        res.status(500).send(error);
    }
};

    // Enviar email para cambiar contraseña
export const sendEmailPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.find({ email: email });

        if (user) {
            // Genero un token con JWT para restablecer la contrasena
            const token = jwt.sign({ userEmail: email }, 'coder', { expiresIn: '1h' });
            const resetLink = `http://localhost:4000/api/session/reset-password?token=${token}`;

            // Envio el email
            sendEmailChangePassword(email, resetLink);

            res.status(200).send('Email enviado correctamente');
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (error) {
        res.status(500).send(error);
    }
};