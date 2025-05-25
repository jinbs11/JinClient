import { useState, useEffect } from 'react';
import LoadingBar from '../components/LoadingBar';

export default function Splash() {
  return (
    <div className="h-screen bg-[#181824] text-white flex flex-col items-center justify-center gap-4 px-3 select-none">
      <div className="text-xl font-semibold">Loading...</div>
      <LoadingBar />
    </div>
  );
}