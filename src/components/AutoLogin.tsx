import { useEffect } from 'react';
const { ipcRenderer } = window.require('electron'); // Huom: riippuu bundlerista

const AutoLogin = ({ userId, setUser }: { userId: string, setUser: (user: string | null) => void }) => {
  useEffect(() => {
    const tryAutoLogin = async () => {
      try {
        const accessToken = await ipcRenderer.invoke('auto-login', userId);
        if (accessToken) {
          // Token tallennetaan tai käytetään jossain muualla
          // localStorage.setItem('access_token', accessToken); // valinnainen
          setUser(userId); // tai hae nimi jostain
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auto-login error:', error);
        setUser(null);
      }
    };

    tryAutoLogin();
  }, [userId]);

  return null; // Ei renderöi mitään
};

export default AutoLogin;
