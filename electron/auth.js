// auth.js
import fetch from 'node-fetch';
import { getLastUsedUser } from '../server/userHandler.js';

export async function autologin() {
  const user = getLastUsedUser();
  if (!user?.refresh_token) throw new Error("No refresh token");

  const res = await fetch('https://login.live.com/oauth20_token.srf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: 'e6fd8ee6-21b5-482d-988d-b8aae6980d3a',
      client_secret: '',
      refresh_token: user.refresh_token,
      grant_type: 'refresh_token',
      redirect_uri: 'http://localhost:5173/auth-callback'
    })
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("Token refresh failed");

  return data;
}
