import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import dns from 'dns';
import authRoutes from '../routes/auth-routes.js';
import userRoutes from '../routes/user-routes.js';
import productRoutes from '../routes/product-routes.js'
import uploadToCloudinaryRoutes from '../routes/upload-to-cloudinary.js';
import categoryRoutes from '../routes/category-routes.js';
import cartRoutes from '../routes/cart-routes.js';
import orderRoutes from '../routes/order-routes.js';


dotenv.config();

// Override DNS servers in development (some local networks can't resolve Atlas SRV records)
if (process.env.NODE_ENV !== 'production') {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
}

const app = express();

// --- CORS ---
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : [];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// --- Body parser with size limit ---
app.use(express.json({ limit: '100kb' }));

// --- Rate limiting for auth routes ---
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Too many requests. Please try again later.',
    },
});

// --- MongoDB connection (serverless-friendly: lazy + cached) ---
let cachedConnection = null;

async function connectDB() {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }
    cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected');
    return cachedConnection;
}

// Middleware: ensure DB is connected before handling any request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        res.status(500).json({ status: 500, message: 'Database connection failed' });
    }
});

// --- Routes ---
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/upload', uploadToCloudinaryRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/order', orderRoutes);

// --- 404 handler ---
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);

    // CORS error
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            status: 403,
            message: 'Origin not allowed by CORS policy',
        });
    }

    res.status(err.status || 500).json({
        status: err.status || 500,
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    });
});

// --- Start server (local only — Vercel handles this via the export below) ---
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }).catch(err => {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    });
}

// Export for Vercel serverless
export default app;