import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const addPaymentMethod = async (req: AuthRequest, res: Response) => {
  try {
    const { cardNumber, expiryDate, cvv, cardholderName } = req.body;

    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate card number (simple check)
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleanNumber)) {
      return res.status(400).json({ error: 'Please enter a valid credit card number.' });
    }

    // Validate expiry
    const [month, year] = expiryDate.split('/');
    const expYear = parseInt(year);
    if (expYear < 2026 || expYear > 2051) {
      return res.status(400).json({
        error: `Expiration Year must be between 2026 and 2051.`
      });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Add payment method (store only last 4 digits for security)
    user.paymentMethods.push({
      type: 'card',
      lastFour: cleanNumber.slice(-4),
      expiryDate,
      cardType: cleanNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      isDefault: user.paymentMethods.length === 0
    });

    // Activate subscription
    user.subscription.status = 'active';
    user.subscription.startDate = new Date();
    user.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await user.save();

    res.json({
      message: 'Payment method added successfully!',
      subscription: user.subscription,
      paymentMethod: user.paymentMethods[user.paymentMethods.length - 1]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment.' });
  }
};

export const getPaymentMethods = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ paymentMethods: user.paymentMethods });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment methods.' });
  }
};
