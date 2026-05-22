import express from 'express';
import Affiliate from '../models/Affiliate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const affiliates = await Affiliate.find({ active: true });
    res.json(affiliates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/admin', protect, async (req, res) => {
  try {
    const affiliates = await Affiliate.find().sort({ createdAt: -1 });
    res.json(affiliates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const affiliate = await Affiliate.create(req.body);
    res.status(201).json(affiliate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/click', async (req, res) => {
  try {
    await Affiliate.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    res.json({ message: 'Click recorded' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const aff = await Affiliate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(aff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Affiliate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Affiliate deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
