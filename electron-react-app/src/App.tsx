import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TopBar, SideBar } from './components/Bars'
import { SettingsView, ModsView, PlayView } from './components/OptionsView'

function App() {
  const [view, setView] = useState("play");

  const renderContent = () => {
    switch (view) {
      case "play":
        return <div className='h-full'><PlayView/></div>;
      case "mods":
        return <div className='h-full'><ModsView/></div>;
      case "settings":
        return <div className='h-full'><SettingsView/></div>;
      default:
        return <div>Valitse näkymä</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#2B2D3C]">
      {/* Yläpalkki */}
      <TopBar />

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
