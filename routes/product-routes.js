import express from 'express'
import { getProduct, addProduct, updateProduct, deleteProduct } from '../controllers/product-controller.js';
import verifyFirebaseAdmin from '../middleware/auth-middleware.js'


const productRoutes = express.Router();

productRoutes.get('/:productId', getProduct);
productRoutes.post('/', verifyFirebaseAdmin, addProduct);
productRoutes.put('/:productId', verifyFirebaseAdmin, updateProduct);
productRoutes.delete('/:productId', verifyFirebaseAdmin, deleteProduct);


export default productRoutes;