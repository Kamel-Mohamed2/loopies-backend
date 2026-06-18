import express from 'express';
import multer from 'multer'; 
import { uploadToCloudinary } from '../controllers/upload-controller.js'; 
import verifyFirebaseAdmin from '../middleware/auth-middleware.js';

const uploadToCloudinaryRoutes = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } 
});

uploadToCloudinaryRoutes.post('/', verifyFirebaseAdmin, upload.single('image'), uploadToCloudinary);

export default uploadToCloudinaryRoutes;