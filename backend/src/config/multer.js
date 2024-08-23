
import multer from "multer";
import { __dirname } from "../path.js";


const storageDocs = multer.diskStorage({
    // objeto de configuracion, cb es callback
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/documents`);
    },
    // nombre del documento
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});

const storageProducts = multer.diskStorage({
    // objeto de configuracion, cb es callback
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/img/products`);
    },
    // fecha y nombre de las img
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    },
});

const storageProfiles = multer.diskStorage({
    // objeto de configuracion, cb es callback
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/img/profiles`);
    },
    // nombre de las img
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});


export const uploadProd = multer({ storage: storageProducts });
export const uploadDocs = multer({ storage: storageDocs });
export const uploadProfiles = multer({ storage: storageProfiles });