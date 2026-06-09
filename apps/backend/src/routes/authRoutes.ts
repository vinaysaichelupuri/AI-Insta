import { Request, Response, Router } from "express";
import axios from "axios";
import { resolveRequestUser } from "../utils/authUser";

const router = Router();
const graphVersion = process.env.META_GRAPH_VERSION || "v19.0";
const instagramGraphBaseUrl = `https://graph.instagram.com/${graphVersion}`;
const instagramOauthBaseUrl = "https://www.instagram.com/oauth/authorize";
const instagramOauthTokenUrl = "https://api.instagram.com/oauth/access_token";

const defaultScopes = [
  "instagram_business_basic",
  "instagram_business_content_publish",
];

const getMetaConfig = () => {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const scopes = (process.env.META_SCOPES || defaultScopes.join(","))
    .split(",")
    .map((scope) => scope.trim())
    .filter(Boolean);

  return { appId, appSecret, scopes };
};

const getMissingMetaConfig = () => {
  const { appId, appSecret } = getMetaConfig();
  return [
    !appId ? "META_APP_ID" : null,
    !appSecret ? "META_APP_SECRET" : null,
  ].filter(Boolean);
};

router.get("/instagram/config", (_req: Request, res: Response) => {
  const missing = getMissingMetaConfig();
  res.status(200).json({
    configured: missing.length === 0,
    graphVersion,
    loginMode: "instagram_login",
    missing,
  });
});

router.get("/instagram/status", async (req: Request, res: Response) => {
  try {
    const user = await resolveRequestUser(req);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const missing = getMissingMetaConfig();
    const connected = Boolean(user.instagramAccessToken && user.instagramAccountId);

    return res.status(200).json({
      configured: missing.length === 0,
      loginMode: "instagram_login",
      missing,
      connected,
      account: connected ? {
        instagramAccountId: user.instagramAccountId,
        instagramUsername: user.instagramUsername || null,
        facebookPageId: user.facebookPageId || null,
        facebookPageName: user.facebookPageName || null,
        tokenExpiresAt: user.instagramTokenExpiresAt || null,
      } : null,
    });
  } catch (error) {
    console.error("Error checking Instagram status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/instagram/connect-url", async (req: Request, res: Response) => {
  const { appId, scopes } = getMetaConfig();
  const missing = getMissingMetaConfig();
  const redirectUri = typeof req.query.redirectUri === "string" ? req.query.redirectUri : null;

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Meta app is not fully configured on the backend",
      missing,
    });
  }

  if (!redirectUri) {
    return res.status(400).json({ error: "redirectUri is required" });
  }

  const user = await resolveRequestUser(req);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const params = new URLSearchParams({
    client_id: appId!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(","),
  });
  params.set("force_reauth", "true");

  return res.status(200).json({
    url: `${instagramOauthBaseUrl}?${params.toString()}`,
    scopes,
  });
});

router.post("/instagram/exchange-code", async (req: Request, res: Response) => {
  try {
    const missing = getMissingMetaConfig();
    if (missing.length > 0) {
      return res.status(400).json({
        error: "Meta app is not fully configured on the backend",
        missing,
      });
    }

    const { appId, appSecret } = getMetaConfig();
    const { code, redirectUri } = req.body;

    if (!code || !redirectUri) {
      return res.status(400).json({ error: "code and redirectUri are required" });
    }

    const user = await resolveRequestUser(req);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const shortLivedTokenParams = new URLSearchParams({
      client_id: appId!,
      client_secret: appSecret!,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
    });

    const shortLivedTokenResponse = await axios.post(
      instagramOauthTokenUrl,
      shortLivedTokenParams,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const shortLivedToken = shortLivedTokenResponse.data.access_token;
    const shortLivedUserId = shortLivedTokenResponse.data.user_id;

    const longLivedTokenResponse = await axios.get("https://graph.instagram.com/access_token", {
      params: {
        grant_type: "ig_exchange_token",
        client_secret: appSecret,
        access_token: shortLivedToken,
      },
    });

    const accessToken = longLivedTokenResponse.data.access_token || shortLivedToken;
    const expiresIn = Number(longLivedTokenResponse.data.expires_in || 0);

    const profileResponse = await axios.get(`${instagramGraphBaseUrl}/me`, {
      params: {
        fields: "user_id,username",
        access_token: accessToken,
      },
    });

    const instagramAccountId = profileResponse.data?.user_id || shortLivedUserId || profileResponse.data?.id;
    const instagramUsername = profileResponse.data?.username || undefined;

    if (!instagramAccountId) {
      return res.status(400).json({
        error: "Instagram Login succeeded, but no Instagram account ID was returned.",
      });
    }

    user.instagramAccessToken = accessToken;
    user.instagramAccountId = instagramAccountId;
    user.instagramUsername = instagramUsername;
    user.facebookPageId = undefined;
    user.facebookPageName = undefined;
    user.instagramTokenExpiresAt = expiresIn > 0
      ? new Date(Date.now() + expiresIn * 1000)
      : undefined;
    await user.save();

    return res.status(200).json({
      message: "Instagram account connected successfully",
      account: {
        instagramAccountId: user.instagramAccountId,
        instagramUsername: user.instagramUsername || null,
        facebookPageId: user.facebookPageId || null,
        facebookPageName: user.facebookPageName || null,
        tokenExpiresAt: user.instagramTokenExpiresAt || null,
      },
    });
  } catch (error) {
    console.error("Error exchanging Instagram auth code:", error);
    return res.status(500).json({ error: "Failed to connect Instagram account" });
  }
});

router.post("/instagram/token", async (req: Request, res: Response) => {
  try {
    const {
      email,
      instagramAccessToken,
      instagramAccountId,
      facebookPageId,
      facebookPageName,
      instagramUsername,
    } = req.body;

    if (!email || !instagramAccessToken || !instagramAccountId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await resolveRequestUser(req);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.instagramAccessToken = instagramAccessToken;
    user.instagramAccountId = instagramAccountId;
    user.facebookPageId = facebookPageId;
    user.facebookPageName = facebookPageName;
    user.instagramUsername = instagramUsername;
    await user.save();

    return res.status(200).json({ message: "Instagram tokens stored successfully", user });
  } catch (error) {
    console.error("Error storing Instagram token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
