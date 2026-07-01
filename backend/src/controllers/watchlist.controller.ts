import { Response } from 'express';
import { User } from '../models/User.model';
import { Content } from '../models/Content.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const addToWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const { contentId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (!user.watchlist.includes(contentId)) {
      user.watchlist.push(contentId);
      await user.save();
    }

    res.json({ message: 'Added to My List', watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to watchlist.' });
  }
};

export const removeFromWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const { contentId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.watchlist = user.watchlist.filter(id => id.toString() !== contentId);
    await user.save();

    res.json({ message: 'Removed from My List', watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from watchlist.' });
  }
};

export const getWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).populate('watchlist');
    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch watchlist.' });
  }
};
