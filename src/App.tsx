import React from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Navigator from 'components/Navigator';

export default function App() {
  const [currentMode, setCurrentMode] = useState<string | null>(null);

  const handleCurrentMode = (nextMode: string): void => {
    setCurrentMode(nextMode);
  };

  return (
    <div id="app">
      {/* TODO: should change true to currentMode !== 'auth' or something else */}
      {true && (
        <Navigator
          currentMode={currentMode}
          handleCurrentMode={handleCurrentMode}
        />
      )}
      <div id="main">
        <Outlet />
      </div>
    </div>
  );
}