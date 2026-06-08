import { Request, Response, Router } from "express";
import { User } from "../models/User";

const router = Router();

// This is a simplified OAuth flow for storing Instagram tokens.
// In a real OAuth flow, this would handle the redirect from Instagram.
router.post("/instagram/token", async (req: Request, res: Response) => {
  try {
    const { email, instagramAccessToken, instagramAccountId } = req.body;
    
    if (!email || !instagramAccessToken || !instagramAccountId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { instagramAccessToken, instagramAccountId },
      { new: true, upsert: true } // Upsert for easy testing
    );

    res.status(200).json({ message: "Instagram tokens stored successfully", user });
  } catch (error) {
    console.error("Error storing Instagram token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
