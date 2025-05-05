const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Varmista että tämä on asennettu: npm install node-fetch

const app = express();
const PORT = 5174;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// 🔁 VANHA REITTI – säilytetään jos käytät sitä
app.get('/resourcepacks', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'resourcepacks.json'));
  res.json(JSON.parse(data));
});

// 🔐 UUSI REITTI – Microsoft → Minecraft käyttäjänimi
app.post('/auth/token', async (req, res) => {
  const { code } = req.body;
  const clientId = "e6fd8ee6-21b5-482d-988d-b8aae6980d3a"; // ⬅️ Vaihda oikeaan
  const redirectUri = "http://localhost:5173/auth-callback";

  try {
    console.log("🔁 Step 1: Received code:", code);

    // 1. Microsoft token
    const tokenRes = await fetch("https://login.microsoftonline.com/consumers/oauth2/v2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri
      }),
    });
    const tokenData = await tokenRes.json();
    console.log("✅ Step 2: Access token response:", tokenData);

    const accessToken = tokenData.access_token;
    if (!accessToken) throw new Error("Access token missing");

    // 2. Xbox Live
    const xblRes = await fetch("https://user.auth.xboxlive.com/user/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Properties: {
          AuthMethod: "RPS",
          SiteName: "user.auth.xboxlive.com",
          RpsTicket: `d=${accessToken}`
        },
        RelyingParty: "http://auth.xboxlive.com",
        TokenType: "JWT"
      })
    });
    const xblData = await xblRes.json();
    console.log("✅ Step 3: Xbox Live token:", xblData);

    const xblToken = xblData.Token;
    const uhs = xblData.DisplayClaims?.xui?.[0]?.uhs;
    if (!xblToken || !uhs) throw new Error("Xbox Live token or uhs missing");

    // 3. XSTS token
    const xstsRes = await fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Properties: {
          SandboxId: "RETAIL",
          UserTokens: [xblToken]
        },
        RelyingParty: "rp://api.minecraftservices.com/",
        TokenType: "JWT"
      })
    });
    const xstsData = await xstsRes.json();
    console.log("✅ Step 4: XSTS token:", xstsData);

    const xstsToken = xstsData.Token;
    if (!xstsToken) throw new Error("XSTS token missing");

    // 4. Minecraft access token
    const mcAuthRes = await fetch("https://api.minecraftservices.com/authentication/login_with_xbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identityToken: `XBL3.0 x=${uhs};${xstsToken}`
      })
    });
    const mcAuthData = await mcAuthRes.json();
    console.log("✅ Step 5: Minecraft access token:", mcAuthData);

    const mcAccessToken = mcAuthData.access_token;
    if (!mcAccessToken) throw new Error("Minecraft access token missing");

    // 5. Minecraft profile
    const profileRes = await fetch("https://api.minecraftservices.com/minecraft/profile", {
      headers: { Authorization: `Bearer ${mcAccessToken}` }
    });
    const profile = await profileRes.json();
    console.log("🎮 Step 6: Minecraft profile:", profile);

    res.json({ username: profile.name });
  } catch (err) {
    console.error("❌ Authentication error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
