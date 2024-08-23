
import jwt from 'jsonwebtoken'
import varenv from '../dotenv.js'


export const generateToken = (user) => {

    /*
        1°: Objeto de asociacion del token (Usuario)
        2°: Clave privada del cifrado
        3°: Tiempo de expiracion
    */

    const token = jwt.sign({ user }, varenv.jwt_secret, { expiresIn: '24h'})
    return token
}

console.log(generateToken({
    "_id": "6629f99ce5ed7ce5ebd40e93",
    "first_name": "Sofia",
    "last_name": "Micaela",
    "password": "$2b$14$4RH5hbyrFvfx.Tg1IcfOqeAcwG7gdM.oiOHEPxT0JiwdTylYItASC",
    "age": 24,
    "email": "sofia@micaela.com",
    "rol": "Admin",
    "__v": 0
}))