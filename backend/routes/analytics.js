import express from 'express';
import Post from '../models/Post.js';
import Newsletter from '../models/Newsletter.js';
import Affiliate from '../models/Affiliate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const publishedPosts = await Post.countDocuments({ status: 'published' });
    const draftPosts = await Post.countDocuments({ status: 'draft' });
    const totalViews = await Post.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]);
    const subscribers = await Newsletter.countDocuments({ active: true });
    const topPosts = await Post.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('title views slug');
    const affiliateClicks = await Affiliate.aggregate([{ $group: { _id: null, total: { $sum: '$clicks' } } }]);
    const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt');

    res.json({
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews: totalViews[0]?.total || 0,
      subscribers,
      topPosts,
      affiliateClicks: affiliateClicks[0]?.total || 0,
      recentPosts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
