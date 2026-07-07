// firebase.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

let auth = null;

try {
    if (getApps().length === 0) {
        
        const privateKey = process.env.FIREBASE_PRIVATE_KEY 
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
            : undefined;

        if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
            console.error("❌ Missing Firebase environment variables — auth will not work");
        } else {
            initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                })
            });
            
            console.log("✅ Firebase Admin SDK initialized successfully via sub-exports!");
        }
    }
    auth = getApps().length > 0 ? getAuth() : null;
} catch (error) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error.message);
}

export default auth;