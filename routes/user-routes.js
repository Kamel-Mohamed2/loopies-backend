import express from 'express';
import verifyFirebaseAdmin from '../middleware/auth-middleware.js';
import { getUserById , getAllUsers , deleteUser } from '../controllers/user-controller.js';


const userRoutes = express.Router();

userRoutes.get('/get-user/:uid' , verifyFirebaseAdmin , getUserById);
userRoutes.get('/get-all-users' , verifyFirebaseAdmin , getAllUsers);
userRoutes.delete('/delete-user/:uid' , verifyFirebaseAdmin , deleteUser);



export default userRoutes;