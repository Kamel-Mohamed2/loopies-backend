import express from 'express'
import { getOrders, getOrder, addOrder } from '../controllers/order-controller.js'
import verifyFirebaseAdmin from '../middleware/auth-middleware.js'
import verifyFirebaseToken from '../utils/firebase-token-verify.js'



const orderRoutes = express.Router()

orderRoutes.get('/', verifyFirebaseAdmin, getOrders)
orderRoutes.get('/:orderId', getOrder)
orderRoutes.post('/', verifyFirebaseToken, addOrder)
// orderRoutes.put('/:orderId',)
// orderRoutes.delete('/:orderId',)

export default orderRoutes;