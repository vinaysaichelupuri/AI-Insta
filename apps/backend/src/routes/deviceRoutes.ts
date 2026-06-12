// POST /api/devices/register
// Registers an Expo push token for the authenticated user

import { Request, Response, Router } from 'express';
import { resolveRequestUser } from '../utils/authUser';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const user = await resolveRequestUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { expoPushToken } = req.body;
    if (!expoPushToken || typeof expoPushToken !== 'string') {
      return res.status(400).json({ error: 'expoPushToken is required' });
    }

    // Store token (deduplicated)
    const tokens: string[] = (user as any).expoPushTokens ?? [];
    if (!tokens.includes(expoPushToken)) {
      (user as any).expoPushTokens = [...tokens, expoPushToken];
      await user.save();
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[DeviceRoute] Error registering device:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
