import express from 'express';
import dotenv from 'dotenv';
import verifyFirebaseToken from '../utils/firebase-token-verify.js';
import { signUp, signIn, signOut } from '../controllers/auth-controller.js';

dotenv.config();

const authRoutes = express.Router();

authRoutes.post('/sign-up', verifyFirebaseToken, signUp);

authRoutes.post('/sign-in', verifyFirebaseToken, signIn);

authRoutes.post('/sign-out', verifyFirebaseToken, signOut);


export default authRoutes;