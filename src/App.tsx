import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Navigator from 'components/Navigator/Navigator';
import { useAppSelector } from 'App.hooks';
import { CookiesProvider } from 'react-cookie';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

export enum RouteMode {
  DATASET,
  MODELS,
}

export default function App() {
  const [currentMode, setCurrentMode] = useState(RouteMode.DATASET);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const SAMModelLoading = useAppSelector(
    (state) => state.annotator.SAM.modelLoading,
  ) as boolean;
  const SAMEverythingLoading = useAppSelector(
    (state) => state.annotator.SAM.everythingLoading,
  ) as boolean;
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
        {SAMModelLoading && (
          <LoadingSpinner message="SAM을 불러오는 중입니다..." />
        )}
        {SAMEverythingLoading && (
          <LoadingSpinner message="SAM Everything 생성중입니다..." />
        )}
      </div>
    </CookiesProvider>
  );
}
