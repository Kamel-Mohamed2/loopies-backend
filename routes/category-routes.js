import express from 'express';
import verifyFirebaseAdmin from '../middleware/auth-middleware.js';
import { getCategory , getAllCategories , updateCategory , addCategory } from '../controllers/category-controller.js';

const categoryRoutes = express.Router();

categoryRoutes.get('/' , getAllCategories)
categoryRoutes.get('/:categoryId' , getCategory)
categoryRoutes.post('/' , verifyFirebaseAdmin , addCategory )
categoryRoutes.put('/:categoryId' , verifyFirebaseAdmin , updateCategory )


export default categoryRoutes
