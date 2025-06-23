import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './MainComponent'; 


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <pagetwoComponent city="Gothenburg" />
  </React.StrictMode>
);