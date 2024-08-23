
import local from 'passport-local'
import passport from 'passport'
import crypto from 'crypto'
import GithubStrategy from 'passport-github2'
import { userModel } from '../../models/user.js'
import { createHash, validatePassword } from '../../utils/bcrypt.js'
import { strategyJWT } from './strategies/jwtStrategy.js'


//Passport trabaje con uno o mas middlewares
const localStrategy = local.Strategy

const initializePassport = () => {
    //Definir en que rutas se aplican mis estrategias


  // Crear el usuario
    passport.use('register', new localStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, email, password, age } = req.body
            const findUser = await userModel.findOne({ email: email })
            if (findUser) {
                // No creo el usuario
                return done(null, false)
            } else {
                const user = await userModel.create({ first_name: first_name, last_name: last_name, email: email, age: age, password: createHash(password) })
            // Creo el usuario
                return done(null, user)
            }
        } catch (e) {
          // Devuelve error
            return done(e)
        }
    }))

    //Inicializar la sesion del usuario
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    //Eliminar la sesion del usuario
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })


  // Loguear al usuario
    passport.use('login', new localStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
          // Busca el usuario en la DB
            const user = await userModel.findOne({ email: username })

          // Si usuario y contraseña existen, se devuelve el login iniciado
            if (user && validatePassword(password, user.password)) {
                //Actualizo con lo que seria la ultima conexion
                user.last_connection = new Date()
                await user.save()
                return done(null, user)
            } else {
                return done(null, false)
            }
        } catch (e) {
            return done(e)
        }
    }))
    /*
    passport.use('github', new GithubStrategy({
        clientID: "",
        clientSecret: "",
        callbackURL: "http://localhost:8000/api/session/githubSession"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ email: profile._json.email }).lean()
            if (user) {
                done(null, user)
            } else {
                const randomNumber = crypto.randomUUID()
                console.log(profile._json)
                const userCreated = await userModel.create({ first_name: profile._json.name, last_name: ' ', email: profile._json.email, age: 18, password: createHash(`${profile._json.name}`) })
                console.log(randomNumber)
                return done(null, userCreated)
            }
        } catch (error) {
            return done(error)
        }
    }))
    */
    passport.use('jwt', strategyJWT)

}
export default initializePassport