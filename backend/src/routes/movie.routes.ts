import { Router } from 'express';
import { getTrending, getPopular, getTopRated, searchContent, getContentDetails } from '../controllers/movie.controller';

const router = Router();

router.get('/trending', getTrending);
router.get('/popular', getPopular);
router.get('/top-rated', getTopRated);
router.get('/search', searchContent);
router.get('/:id', getContentDetails);

export default router;
