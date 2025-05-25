import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TopBar, SideBar } from './components/Bars'
import { SettingsView, ModsView, PlayView } from './components/OptionsView'

function App() {

  useEffect(() => {
    window.electronAPI.authAPI.autologin()
      .then((data) => {
        window.accessToken = data.access_token;
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
          window.accessToken = data.access_token;
          // voit myös kutsua onLogin(data.username) tms.
        }
      });
  }, []);
  
  const [view, setView] = useState("play");
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (username: string) => {
    localStorage.setItem("username", username);
    setUser(username);
  };

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
      <TopBar user={user} onLogin={handleLogin} />

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
