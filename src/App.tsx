import { useAppSelector } from 'App.hooks';
import Navigator from 'components/Navigator/Navigator';
import { useState } from 'react';
import { CookiesProvider } from 'react-cookie';
import { Outlet } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from 'store';
import './App.css';

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
    <PersistGate persistor={persistor}>
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
    </PersistGate>
  );
}
