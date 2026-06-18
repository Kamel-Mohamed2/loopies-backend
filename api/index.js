import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import authRoutes from '../routes/auth-routes.js';
import userRoutes from '../routes/user-routes.js';


dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

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