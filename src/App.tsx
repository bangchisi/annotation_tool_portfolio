import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Navigator from 'components/Navigator';

export default function App() {
  return (
    <div id="app">
      <Navigator />
      <div id="main">
        <Outlet />
      </div>
    </div>
  );
}
