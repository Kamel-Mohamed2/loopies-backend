import express from 'express.js'
import verifyFirebaseAdmin from '../middleware/auth-middleware';
import { getCategory , getAllCategories , updateCategory , addCategory } from '../controllers/category-controller';

const categoryRoutes = express.Router();

categoryRoutes.get('/' , getAllCategories)
categoryRoutes.get('/:categoryId' , getCategory)
categoryRoutes.post('/' , verifyFirebaseAdmin , addCategory )
categoryRoutes.put('/:categoryId' , verifyFirebaseAdmin , updateCategory )


export default categoryRoutes
