// MicrosoftAuth.js
import fetch from 'node-fetch';
import { saveUserToDB } from './userHandler.js';

class MicrosoftAuth {
  constructor(options = {}) {
    this.options = options;
  }

  async getTokens() {
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

    this.options.access_token = json.access_token;
    this.options.refresh_token = json.refresh_token;

    return json;
  }

  async getXBL() {
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

    this.xbl = json;
    return json;
  }

  async getXSTS(token) {
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

    this.xsts = json;
    return json;
  }

  async getXboxLogin() {
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
  
    if (!json.access_token) {
      throw new Error(`❌ Failed to log in to Minecraft services: ${JSON.stringify(json)}`);
    }
  
    this.xboxLogin = json;
    return json;
  }

  async getMCStore() {
    const res = await fetch('https://api.minecraftservices.com/entitlements/mcstore', {
      headers: { Authorization: `Bearer ${this.xboxLogin.access_token}` }
    });

    const json = await res.json();

    if (!json.items || !Array.isArray(json.items)) {
      return null;
    }

    const hasGame = json.items.find(x => x.name === 'product_minecraft' || x.name === 'game_minecraft');
    return hasGame;
  }

  async getProfile() {
    const res = await fetch('https://api.minecraftservices.com/minecraft/profile', {
      headers: { Authorization: `Bearer ${this.xboxLogin.access_token}` }
    });

    const json = await res.json();

    const profile = {
      refresh_token: this.options.refresh_token,
      access_token: this.xboxLogin.access_token,
      uuid: json.id,
      name: json.name,
      user_properties: {} // voit laajentaa myöhemmin
    };

    // 🔥 Tallenna käyttäjä tietokantaan
    saveUserToDB(profile);

    return profile;
  }



}

export default MicrosoftAuth;
