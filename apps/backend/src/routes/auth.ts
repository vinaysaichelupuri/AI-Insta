import { Router, Request, Response } from 'express';
import { login } from '../controllers/auth';
import { User } from '../models/User';

const router = Router();

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register  — dev-only quick user creation
// In production this would be replaced by a proper signup flow
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }
    // Storing plain password for dev; in production use bcrypt
    const user = await User.create({ email, passwordHash: password });
    res.status(201).json({ message: 'User created', id: user._id, email: user.email });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
