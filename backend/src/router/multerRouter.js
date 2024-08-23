
import { Router } from 'express';
import { insertImg, insertDoc } from '../controllers/multerController.js';
import { uploadProd, uploadDocs, uploadProfiles } from '../config/multer.js';

const multerRouter = Router()

// .single() es un metodo de multer para enviar solo un elemento a la vez
multerRouter.post('/profiles', uploadProfiles.single('profile'), insertImg)
multerRouter.post('/docs', uploadDocs.single('doc'), insertDoc)
multerRouter.post('/products', uploadProd.single('product'), insertImg)

export default multerRouter;