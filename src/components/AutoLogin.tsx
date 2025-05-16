import { useEffect } from 'react';

const AutoLogin = ({ setUser }: { setUser: (user: string | null) => void }) => {
  useEffect(() => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return;

    fetch("http://localhost:5174/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          setUser(data.username);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  return null; // Ei renderöi mitään
};

export default AutoLogin;
