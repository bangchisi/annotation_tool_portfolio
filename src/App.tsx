import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Navigator from 'components/Navigator';
import { useAppSelector } from 'App.hooks';
import { CookiesProvider } from 'react-cookie';

export default function App() {
  const [currentMode, setCurrentMode] = useState<string | null>(null);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleCurrentMode = (nextMode: string): void => {
    setCurrentMode(nextMode);
  };

  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <div id="app">
        {isAuthenticated && (
          <Navigator
            currentMode={currentMode}
            handleCurrentMode={handleCurrentMode}
          />
        )}
        <div id="main">
          <Outlet />
        </div>
      </div>
    </CookiesProvider>
  );
}
