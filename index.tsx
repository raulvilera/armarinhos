import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@fontsource/manrope';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
