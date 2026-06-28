import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import authRoutes from '../routes/auth-routes.js';
import userRoutes from '../routes/user-routes.js';
import productRoutes from '../routes/product-routes.js'
import uploadToCloudinaryRoutes from '../routes/upload-to-cloudinary.js';
import categoryRoutes from '../routes/category-routes.js';
import cartRoutes from '../routes/cart-routes.js';
import orderRoutes from '../routes/order-routes.js';


dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/upload', uploadToCloudinaryRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/order', orderRoutes);



async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Mongo connected");
  } catch (err) {
    console.error(err.message);
  }
}
connectDB();



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});