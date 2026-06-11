import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const normalizedEmail = email ? email.trim() : '';
    console.log(`[LOGIN ATTEMPT] Email received: "${email}", normalized: "${normalizedEmail}"`);
    
    const user = await User.findOne({ email: new RegExp(`^${normalizedEmail}$`, 'i') });
    console.log(`[LOGIN ATTEMPT] User found in DB: ${user ? `YES (DB Email: "${user.email}")` : 'NO'}`);
    
    if (user) {
      if (user.passwordHash === password) {
        console.log(`[LOGIN ATTEMPT] Password matches! Logging in.`);
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
        return res.json({ token, user: { id: user._id, email: user.email } });
      } else {
        console.log(`[LOGIN ATTEMPT] Password mismatch. Provided: "${password}", Expected: "${user.passwordHash}"`);
      }
    }
    
    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
