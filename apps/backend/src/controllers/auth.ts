import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    // In a real app, compare hashed password
    if (user && user.passwordHash === password) {
      const token = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '30d' });
      return res.json({ token, user: { id: user._id, email: user.email } });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
