import React from "react";

const handleLaunch = () => {
    // Kutsu Electronin backendia IPC:n kautta
    window.electronAPI.launchGame();
};

export const PlayView  = () => {
    return (
        <div className="w-full h-full select-none">
            <h1 className="text-2xl font-bold mb-3">Play</h1>
            <div className="w-full h-full bg-[#242635] rounded">
                <div className="flex flex-col gap-5 items-center justify-center "> 
                    <button className="bg-green-700 text-xl rounded-md px-20 py-4 mt-10 hover:bg-green-800" onClick={handleLaunch}>Play</button>
                    <input 
                        type="text"
                        className="w-96 h-6 px-2 text rounded border border-gray-400 text-black focus:outline-none"
                        placeholder="Your local file location. ex:"
                    ></input>
                </div>
            </div>
        </div>
    )
}

export const ModsView  = () => {
    return (
        <div className="w-full h-full grid grid-cols-2 gap-5">
            <div className="w-full h-full bg-[#242635] rounded text-center">
                <h1 className="text-2xl font-bold mb-3 mt-1">Mods</h1>
            </div>
            <div className="w-full h-full bg-[#242635] rounded text-center">
                <h1 className="text-2xl font-bold mb-3 mt-1">Recource Packs</h1>
            </div>
        </div>
    )
}

export const SettingsView  = () => {
    return (
        <div className="w-full h-full">
            <h1 className="text-2xl font-bold mb-3">Settings</h1>
            <div className="w-full h-full bg-[#242635] rounded"></div>
        </div>
    )
}