import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TopBar, SideBar } from './components/Bars'
import { SettingsView, ModsView, PlayView } from './components/OptionsView'

interface User {
  username: string
}

function App() {
  const [refreshUser, setRefreshUser] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState("play");

useEffect(() => {
  window.electronAPI.authAPI.autologin()
    .then((data) => {
      window.accessToken = data.access_token;
      setRefreshUser(prev => prev + 1); // ⬅️ käynnistää /me haun
    })
    .catch(async () => {
      const code = await window.electronAPI.invoke("login-with-microsoft");
      if (code) {
        const res = await fetch("http://localhost:5174/auth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        console.log(data)
        window.accessToken = data.access_token;
        setRefreshUser(prev => prev + 1); // ⬅️ uusi käyttäjä nyt tietokannassa
      }
    });
}, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5174/me");

        if (res.status === 404) {
          setUser(null);
          return;
        }

        if (!res.ok) throw new Error("Virheellinen vastaus");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();
  }, [refreshUser]); // ⬅️ haku käynnistyy aina kun triggeri muuttuu

  const renderContent = () => {
    switch (view) {
      case "play":
        return <div className='h-full'><PlayView/></div>;
      case "mods":
        return <div className='h-full'><ModsView/></div>;
      case "settings":
        return <div className='h-full'><SettingsView/></div>;
      default:
        return <div>Select View</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#2B2D3C]">
      {/* Yläpalkki */}
      <TopBar user={user}/>

      {/* Sivupalkki + sisältö rivissä */}
      <div className="flex flex-1">
        {/* Sivupalkki vasemmalle */}
        <SideBar setView={setView} />

        {/* Sisältöalue */}
        <main className="flex-1 p-6 text-white">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App
