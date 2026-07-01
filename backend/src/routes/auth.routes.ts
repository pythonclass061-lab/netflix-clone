import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', [
  body('email').isEmail().withMessage('Please enter a valid email address.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('name').trim().notEmpty().withMessage('Name is required.')
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.')
], login);

router.get('/me', authenticate, getCurrentUser);

export default router;
