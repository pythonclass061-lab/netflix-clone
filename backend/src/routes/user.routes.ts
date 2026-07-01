import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { User } from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';

const router = Router();

// Update profile
router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { name, avatar } },
      { new: true }
    );
    res.json({ user: user?.toJSON() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// Add profile
router.post('/profiles', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar, isKid } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.profiles.push({ name, avatar: avatar || 'default-avatar.png', isKid: isKid || false });
    await user.save();

    res.json({ profiles: user.profiles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add profile.' });
  }
});

// Update continue watching
router.post('/continue-watching', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { contentId, progress } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const existing = user.continueWatching.find(
      cw => cw.contentId.toString() === contentId
    );

    if (existing) {
      existing.progress = progress;
      existing.timestamp = new Date();
    } else {
      user.continueWatching.push({ contentId, progress, timestamp: new Date() });
    }

    await user.save();
    res.json({ continueWatching: user.continueWatching });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress.' });
  }
});

export default router;
