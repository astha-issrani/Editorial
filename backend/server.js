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

app.use(cors({ origin: '*', credentials: false }));
app.options('*', cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static('uploads'));
}

app.get('/cors-test', (req, res) => res.json({ cors: 'open', version: 'v2' }));
app.get('/', (req, res) => res.json({ message: 'The Editorial API Running' }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/affiliates', affiliateRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/newsletter', newsletterRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/the-editorial')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

export default app;