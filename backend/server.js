import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import categoryRoutes from './routes/categories.js';
import affiliateRoutes from './routes/affiliates.js';
import analyticsRoutes from './routes/analytics.js';
import newsletterRoutes from './routes/newsletter.js';

dotenv.config();

const app = express();

// ✅ CORS — allow localhost + your deployed frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());

// ⚠️ Vercel is read-only — static file serving won't work in prod
// Use Cloudinary or S3 for uploads instead
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static('uploads'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/affiliates', affiliateRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.get('/', (req, res) => res.json({ message: 'The Editorial API Running' }));

// ✅ Connect MongoDB once (cached for serverless warm calls)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/the-editorial');
  isConnected = true;
  console.log('MongoDB connected');
};

connectDB().catch(err => console.error('MongoDB connection error:', err));

// ✅ Only listen locally — Vercel handles this in prod
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// ✅ Required export for Vercel
export default app;