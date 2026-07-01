import { Router } from 'express';
import { addPaymentMethod, getPaymentMethods } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/add-card', authenticate, addPaymentMethod);
router.get('/methods', authenticate, getPaymentMethods);

export default router;
