import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Capacitor } from '@capacitor/core';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Check if running on mobile platform
const isMobile = Capacitor.isNativePlatform();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log platform info
console.log('Running on platform:', Capacitor.getPlatform());
console.log('Is native platform:', isMobile);
