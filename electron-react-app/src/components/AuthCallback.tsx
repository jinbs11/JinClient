import { useEffect } from "react";

const AuthCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code || !window.opener) {
      console.error("❌ No code or no parent window");
      return;
    }

    console.log("✅ Code received in popup:", code);

    // Lähetä koodi pääikkunaan
    window.opener.postMessage({ type: "auth-code", code }, "*");

    // Sulje popup
    window.close();
  }, []);

  return <div>Kirjaudutaan sisään...</div>;
};

export default AuthCallback;
