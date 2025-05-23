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
        window.accessToken = data.access_token; // tallennetaan globaalisti
      })
      .catch((err) => console.error("Autologin error: ", err));
  }, []);
  
  const [view, setView] = useState("play");
  const [user, setUser] = useState<string | null>(null);

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
      <TopBar user={user} onLogin={setUser} />

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
