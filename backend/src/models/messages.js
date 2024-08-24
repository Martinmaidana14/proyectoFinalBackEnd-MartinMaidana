
import { Schema, model } from 'mongoose'

const messageSchema = new Schema({
    email: {
        type: String,
        required: true

        // el mail no es unico porque sino un usuario solo podria enviar un mensaje
    },
    message: {
        type: String,
        required: true
    }
})

const messageModel = model("messages", messageSchema)

export default messageModel