
import bcrypt from 'bcrypt'
import varenv from '../dotenv.js'


export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(varenv.salt)) //14

//const passwordE = createHash("coderhouse")

//console.log(createHash("coderhouse"))

export const validatePassword = (passwordSend, passwordBdd) => bcrypt.compareSync(passwordSend, passwordBdd)

//console.log(validatePassword("coderhouse", passwordE))

//1234 -> 12$t -> 1$rp -> %31p