import { Router } from 'express';
import { addToWatchlist, removeFromWatchlist, getWatchlist } from '../controllers/watchlist.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getWatchlist);
router.post('/add', authenticate, addToWatchlist);
router.delete('/remove/:contentId', authenticate, removeFromWatchlist);

export default router;
