import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { SelectedHorseProvider } from './context/SelectedHorseContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <SelectedHorseProvider>
        <App />
      </SelectedHorseProvider>
    </AuthProvider>
  </BrowserRouter>
  
);