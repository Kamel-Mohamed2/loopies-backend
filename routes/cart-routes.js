import express from 'express';
import { getCartByIdentity, updateCart, clearCart, mergeCarts } from '../controllers/cart-controller.js';
import verifyFirebaseToken from '../utils/firebase-token-verify.js';

const cartRouter = express.Router();

cartRouter.get('/', getCartByIdentity);


cartRouter.put('/', updateCart);

cartRouter.put('/clear', clearCart);


cartRouter.post('/merge', verifyFirebaseToken, mergeCarts);

export default cartRouter;