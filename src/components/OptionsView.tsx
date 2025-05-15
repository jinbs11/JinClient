import React, { useEffect, useState } from 'react';
import { BsToggleOn, BsToggleOff } from 'react-icons/bs';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'


const handleLaunch = () => {
  window.electronAPI.launchGame();
};

export const PlayView = () => {
  return (
    <div className="w-full h-full select-none">
      <h1 className="text-2xl font-bold mb-3">Play</h1>
      <div className="w-full h-full bg-[#242635] rounded">
        <div className="flex flex-col gap-5 items-center justify-center">
          <button
            className="bg-green-700 text-xl rounded-md px-20 py-4 mt-10 hover:bg-green-800"
            onClick={handleLaunch}
          >
            Play
          </button>
          <input
            type="text"
            className="w-96 h-6 px-2 text rounded border border-gray-400 text-black focus:outline-none"
            placeholder="Your local file location. ex:"
          />
        </div>
      </div>
    </div>
  );
};

function ModList({ mods }: { mods: { name: string; url: string; filename: string }[] }) {
    const [enabledStates, setEnabledStates] = useState<boolean[]>(
      Array(mods.length).fill(false)
    );
    const [loadingStates, setLoadingStates] = useState<boolean[]>(
      Array(mods.length).fill(false)
    );
  
    const toggle = (index: number) => {
      if (loadingStates[index]) return;
  
      const mod = mods[index];
  
      setEnabledStates(prev => {
        const newStates = [...prev];
        newStates[index] = !prev[index];
  
        if (!prev[index]) {
          // ✅ Enable mod: copy file to mods folder
          setLoadingStates(ls => {
            const newLs = [...ls];
            newLs[index] = true;
            return newLs;
          });
  
          window.electronAPI.copyMod(mod.filename);
  
          setTimeout(() => {
            setLoadingStates(ls => {
              const newLs = [...ls];
              newLs[index] = false;
              return newLs;
            });
          }, 1000);
        } else {
          // ❌ Disable mod: remove file from mods folder
          window.electronAPI.removeMod(mod.filename);
        }
  
        return newStates;
      });
    };
  
    useEffect(() => {
      const filenames = mods.map(mod => mod.filename);
  
      window.electronAPI.checkInstalledMods(filenames).then(installed => {
        setEnabledStates(installed);
      });
    }, [mods]);
  
    return (
      <ul>
        {mods.map((mod, index) => (
          <div
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              toggle(index);
            }}
            className="flex items-center justify-between p-6 bg-[#212230] rounded mb-2 mx-2 cursor-pointer hover:bg-[#1F202E]"
          >
            <h1 className="text-white">{mod.name}</h1>
  
            <div className="w-8 h-8 flex items-center justify-center">
              {loadingStates[index] ? (
                <AiOutlineLoading3Quarters className="animate-spin text-xl text-gray-400" />
              ) : enabledStates[index] ? (
                <BsToggleOn className="text-3xl text-green-400" />
              ) : (
                <BsToggleOff className="text-3xl text-gray-500" />
              )}
            </div>
          </div>
        ))}
      </ul>
    );
  }

export const ModsView = () => {
  type Mod = {
    name: string;
    url: string;
    filename: string;
  };

  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('../mods.json')
      .then(res => res.json())
      .then(data => {
        setMods(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading mods:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Loading mods...</p>;

  return (
    <div className="w-full h-full grid grid-cols-2 gap-5 select-none">
      <div className="w-full h-full bg-[#242635] rounded text-center">
        <h1 className="text-2xl font-bold mb-3 mt-1">Mods</h1>
        <ModList mods={mods} />
      </div>
      <div className="w-full h-full bg-[#242635] rounded text-center">
        <h1 className="text-2xl font-bold mb-3 mt-1">Resource Packs</h1>
      </div>
    </div>
  );
};

export const SettingsView = () => {
  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold mb-3">Settings</h1>
      <div className="w-full h-full bg-[#242635] rounded"></div>
    </div>
  );
};
