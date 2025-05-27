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
        client_id: "e6fd8ee6-21b5-482d-988d-b8aae6980d3a",
        client_secret: '',
        refresh_token: user.refresh_token,
        grant_type: 'refresh_token',
        redirect_uri: isDev
          ? "http://localhost:5173/auth-callback"
          : "jinclient://auth-callback"
      })
    });

    const tokenData = await tokenRes.json();

    return res.json({ access_token: tokenData.access_token });
  } catch (err) {
    console.error("❌ Refresh token failed:", err);
    return res.status(500).json({ error: 'Token refresh failed' });
  }
});

export default router;
