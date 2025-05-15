// MicrosoftAuth.js
import fetch from 'node-fetch';
import { saveUserToDB } from './userHandler.js';

class MicrosoftAuth {
  constructor(options = {}) {
    this.options = options;
  }

  async getTokens() {
    console.log("🔁 [1/6] Getting Microsoft tokens...");
    const res = await fetch('https://login.live.com/oauth20_token.srf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.options.client_id,
        client_secret: this.options.client_secret,
        code: this.options.code,
        grant_type: 'authorization_code',
        redirect_uri: this.options.redirect_uri
      })
    });

    const json = await res.json();
    console.log("✅ Microsoft tokens received:", json);

    this.options.access_token = json.access_token;
    this.options.refresh_token = json.refresh_token;

    return json;
  }

  async getXBL() {
    console.log("🔁 [2/6] Authenticating with Xbox Live...");
    const res = await fetch('https://user.auth.xboxlive.com/user/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        Properties: {
          AuthMethod: 'RPS',
          SiteName: 'user.auth.xboxlive.com',
          RpsTicket: `d=${this.options.access_token}`
        },
        RelyingParty: 'http://auth.xboxlive.com',
        TokenType: 'JWT'
      })
    });

    const json = await res.json();
    console.log("✅ Xbox Live token received:", json);

    this.xbl = json;
    return json;
  }

  async getXSTS(token) {
    console.log("🔁 [3/6] Getting XSTS token...");
    const res = await fetch('https://xsts.auth.xboxlive.com/xsts/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        Properties: {
          SandboxId: 'RETAIL',
          UserTokens: [token]
        },
        RelyingParty: 'rp://api.minecraftservices.com/',
        TokenType: 'JWT'
      })
    });

    const json = await res.json();
    console.log("✅ XSTS token received:", json);

    this.xsts = json;
    return json;
  }

  async getXboxLogin() {
    console.log("🔁 [4/6] Logging in to Minecraft with Xbox token...");
    const uhs = this.xbl?.DisplayClaims?.xui?.[0]?.uhs;
    const token = this.xsts?.Token;
  
    if (!uhs || !token) {
      throw new Error("❌ Xbox login data missing (uhs or token)");
    }
  
    const res = await fetch('https://api.minecraftservices.com/authentication/login_with_xbox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ identityToken: `XBL3.0 x=${uhs};${token}` })
    });
  
    const json = await res.json();
    console.log("📡 Xbox login response:", json);
  
    if (!json.access_token) {
      throw new Error(`❌ Failed to log in to Minecraft services: ${JSON.stringify(json)}`);
    }
  
    this.xboxLogin = json;
    return json;
  }

  async getMCStore() {
    console.log("🔁 [5/6] Checking if user owns Minecraft...");
    console.log("🔐 Access token to MC Store:", this.xboxLogin?.access_token);

    const res = await fetch('https://api.minecraftservices.com/entitlements/mcstore', {
      headers: { Authorization: `Bearer ${this.xboxLogin.access_token}` }
    });

    const json = await res.json();
    console.log("📦 Minecraft store entitlements response:", json);

    if (!json.items || !Array.isArray(json.items)) {
      console.warn("⚠️ No items in Minecraft store response!");
      return null;
    }

    const hasGame = json.items.find(x => x.name === 'product_minecraft' || x.name === 'game_minecraft');
    if (hasGame) {
      console.log("✅ User owns Minecraft.");
    } else {
      console.warn("❌ User does NOT own Minecraft.");
    }

    return hasGame;
  }

  async getProfile() {
    console.log("🔁 [6/6] Fetching Minecraft profile...");
    const res = await fetch('https://api.minecraftservices.com/minecraft/profile', {
      headers: { Authorization: `Bearer ${this.xboxLogin.access_token}` }
    });

    const json = await res.json();
    console.log("🎮 Minecraft profile data:", json);

    const profile = {
      refresh_token: this.options.refresh_token,
      access_token: this.xboxLogin.access_token,
      uuid: json.id,
      name: json.name,
      user_properties: {} // voit laajentaa myöhemmin
    };

    // 🔥 Tallenna käyttäjä tietokantaan
    saveUserToDB(profile);
    console.log(`💾 Käyttäjä tallennettu tietokantaan: ${profile.name} (${profile.uuid})`);

    return profile;
  }



}

export default MicrosoftAuth;
