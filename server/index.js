// index.js
import express from 'express';
import cors from 'cors';
import MicrosoftAuth from './MicrosoftAuth.js';
const app = express();
const PORT = 5174;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.post('/auth/token', async (req, res) => {
  const { code } = req.body;

  const auth = new MicrosoftAuth({
    client_id: 'e6fd8ee6-21b5-482d-988d-b8aae6980d3a',
    client_secret: '', // lisää jos käytät client_secret
    redirect_uri: 'http://localhost:5173/auth-callback',
    code
  });

  try {
    await auth.getTokens();
    const xbl = await auth.getXBL();
    const xsts = await auth.getXSTS(xbl.Token);
    await auth.getXboxLogin();

    const hasGame = await auth.getMCStore();
    if (!hasGame) return res.status(403).json({ error: 'Account does not own Minecraft' });

    const profile = await auth.getProfile();
    return res.json({ username: profile.name, uuid: profile.uuid });
  } catch (err) {
    console.error("❌ Auth error:", err);
    return res.status(500).json({ error: "Authentication failed" });
  }
});

app.post('/auth/refresh', async (req, res) => {
  const { refresh_token } = req.body;

  const auth = new MicrosoftAuth({
    client_id: 'e6fd8ee6-21b5-482d-988d-b8aae6980d3a',
    client_secret: '',
    redirect_uri: 'http://localhost:5173/auth-callback',
    refresh_token
  });

  try {
    await auth.getTokens(); // Toteuta tämä metodi MicrosoftAuth-luokkaan

    const profile = await auth.getProfile();
    return res.json({ access_token: auth.access_token, username: profile.name });
  } catch (err) {
    console.error("❌ Refresh error:", err);
    return res.status(401).json({ error: "Refresh failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Auth server running at http://localhost:${PORT}`);
});
