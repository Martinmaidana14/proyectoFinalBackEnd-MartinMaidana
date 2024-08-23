
import { Router } from "express";
import passport from "passport";
import {
    login,
    register,
    sessionGithub,
    testJWT,
    logout,
    sendEmailPassword,
    changePassword,
} from '../controllers/sessionController.js';

const sessionRouter = Router()

// Loguear un usuario ya registrado. El req viene desde Passport
sessionRouter.get('/login', passport.authenticate('login'), login);

// Registrar un usuario, que viene desde Passport
sessionRouter.post('/register', passport.authenticate('register'), register)

// Registrar un usuario con estrategia de terceros: GitHub
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })
sessionRouter.get('/githubSession', passport.authenticate('github'), sessionGithub)

sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: false }), testJWT);

// Logout
sessionRouter.get('/logout', logout);

// Enviar email para restablecer contraseña
sessionRouter.post('/sendEmailPassword', sendEmailPassword);

// Se genera token para cambiar contraseña
sessionRouter.post('/reset-password/:token', changePassword);

export default sessionRouter