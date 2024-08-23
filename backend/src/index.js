//Importaciones
import varenv from "./dotenv.js";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from "cookie-parser";
import messageModel from "./models/messages.js";
import indexRouter from "./router/indexRouter.js";
import initializePassport from "./config/passport/passport.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";

//Configuraciones o declaraciones
const app = express();
const PORT = 4000;

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

const io = new Server(server);

//Connection DB
mongoose.connect(varenv.mongo_url)//.connect("mongodb+srv://martinmaidana28:coderhouse@cluster0.cuczn8s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("DB is connected"))
    .catch((e) => console.log(e));

//Middlewares
app.use(express.json());

app.use(
    session({
        secret: varenv.session_secret,//secret: "coderSecret",
        resave: true,
        store: MongoStore.create({
            mongoUrl: varenv.mongo_url,
            ttl: 60 * 60,
        }),
        saveUninitialized: true, //Fuerzo a que la sesion se guarde en lo que seria el storage
    })
);
app.use(cookieParser(varenv.cookies_secret)) //app.use(cookieParser("secretKey")); //Firma de cookie "secretKey"
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

//Passport = SESIONES Y AUTENTICACION todo eso Delege la responsabilidad a lo que seria este Archivo de Configuracion (Passport)
initializePassport();
app.use(passport.initialize()); //Inicia todas las estrategias de autenticacion
app.use(passport.session()); //Generame lo que serian las Session

//Routes
app.use("/", indexRouter);

//Routes Cookies, trabajando con las Cookie que le estan enviando desde lo que es el navegador
app.get("/setCookie", (req, res) => {
    //Forma de Crer Cookie
    res
        .cookie("CookieCookie", "Esto es una cookie :)", {
            maxAge: 3000000,
            signed: true,
        })
        .send("Cookie creada"); //Firma de cookie (signed: true)
});

app.get("/getCookie", (req, res) => {
    //Una forma de Consular la Cookie
    res.send(req.signedCookies); //Cambio de consultar todas las Cookie res.send(req.cookies) a consultar solo por las Cookies Firmadas
});

app.get("/deleteCookie", (req, res) => {
    //Forma de Eliminar Cookie
    res.clearCookie("CookieCookie").send("Cookie eliminada");
    //res.cookie('CookieCokie', '', { expires: new Date(0) })
});

//Session Routes

app.get("/session", (req, res) => {
    //Guardar sesiones de mis usuarios
    console.log(req.session);
    if (req.session.counter) {
        //contar las veces que mi usuario ingreso a esta ruta
        req.session.counter++;
        res.send(
            `Sos el usuario N° ${req.session.counter} en ingresar a la pagina`
        ); //Si ya habia ingresado
    } else {
        //Si ingreso por primera vez
        req.session.counter = 1;
        res.send("Sos el primer usuario que ingresa a la pagina");
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email == "admin@admin.com" && password == "1234") {
        req.session.email = email;
        req.session.password = password;
    }
    console.log(req.session);
    res.send("Login");
});

io.on("connection", (socket) => {
    console.log("Conexion con Socket.io");
    //Msj
    socket.on("mensaje", async (mensaje) => {
        try {
            await messageModel.create(mensaje);
            const mensajes = await messageModel.find();
            io.emit("mensajeLogs", mensajes);
        } catch (e) {
            io.emit("mensajeLogs", e);
        }
    });
});

/*
Paso 1: npm init --yes
Paso 2: "type": "module",
Paso 3: crear carpetas src y dentro config, data y rutes
Paso 4: npm i express
Paso 5: agregar en las dependencias del package.json:
    "scripts": {
        "dev": "node --watch src/index.js"
    },
    Agregando en scripts, en la terminal: npm run dev

Paso 6: crear .gitignore y agregar node_modules
*/

/* Saber cuantos procesadores tengo:
import { cpus } from 'os';
console.log(cpus().length);
*/
