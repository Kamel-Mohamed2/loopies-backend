import express from 'express';
import verifyFirebaseAdmin from '../middleware/auth-middleware.js';
import { getUserById, getAllUsers, deleteUser, addUser } from '../controllers/user-controller.js';


const userRoutes = express.Router();

userRoutes.get('/:uid', verifyFirebaseAdmin, getUserById);
userRoutes.get('/', verifyFirebaseAdmin, getAllUsers);
userRoutes.delete('/:uid', verifyFirebaseAdmin, deleteUser);
userRoutes.post('/', verifyFirebaseAdmin, addUser);




export default userRoutes;