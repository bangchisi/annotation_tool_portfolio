import { TourProvider } from '@reactour/tour';
import { useAppSelector } from 'App.hooks';
import Navigator from 'components/Navigator/Navigator';
import Provider from 'provider';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

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
    <Provider>
      <TourProvider steps={[]}>
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
      </TourProvider>
    </Provider>
  );
}
