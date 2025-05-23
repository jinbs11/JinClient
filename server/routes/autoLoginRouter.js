// autoLogin.js
import express from 'express';
import fetch from 'node-fetch';
import { getLastUsedUser } from '../userHandler.js';

const router = express.Router();

router.post('/autologin', async (req, res) => {
  const user = getLastUsedUser();
  if (!user?.refresh_token) {
    return res.status(401).json({ error: 'No refresh token available' });
  }

  try {
    const tokenRes = await fetch('https://login.live.com/oauth20_token.srf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: user.refresh_token,
        grant_type: 'refresh_token',
        redirect_uri: process.env.REDIRECT_URI
      })
    });

    const tokenData = await tokenRes.json();
    console.log("✅ Refreshed tokens:", tokenData);

    return res.json({ access_token: tokenData.access_token });
  } catch (err) {
    console.error("❌ Refresh token failed:", err);
    return res.status(500).json({ error: 'Token refresh failed' });
  }
});

export default router;
