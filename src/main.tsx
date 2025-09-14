// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
// --- Import the CartProvider ---
import { CartProvider } from './context/CartContext';
// --- End Import ---


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* --- Wrap BrowserRouter with CartProvider --- */}
      <BrowserRouter>
            <CartProvider>
        <App />
            </CartProvider>
      </BrowserRouter>
    {/* --- End Wrap --- */}
  </React.StrictMode>,
);
