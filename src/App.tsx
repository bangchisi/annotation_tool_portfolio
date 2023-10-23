import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Navigator from 'components/Navigator/Navigator';
import { useAppSelector } from 'App.hooks';
import { CookiesProvider } from 'react-cookie';

export enum RouteMode {
  DATASET,
  MODELS,
}

export default function App() {
  const [currentMode, setCurrentMode] = useState(RouteMode.DATASET);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // const handleCurrentMode = (nextMode: string): void => {
  //   setCurrentMode(nextMode);
  // };

  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <div id="app">
        {isAuthenticated && (
          <Navigator
            currentMode={currentMode}
            setCurrentMode={setCurrentMode}
          />
        )}
        <div id="main">
          <Outlet />
        </div>
      </div>
    </CookiesProvider>
  );
}
