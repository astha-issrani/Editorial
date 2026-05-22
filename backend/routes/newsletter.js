import express from 'express';
import Newsletter from '../models/Newsletter.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  try {
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      if (!exists.active) {
        exists.active = true;
        await exists.save();
        return res.json({ message: 'Resubscribed successfully' });
      }
      return res.status(400).json({ message: 'Already subscribed' });
    }
    await Newsletter.create({ email });
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/list', protect, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
