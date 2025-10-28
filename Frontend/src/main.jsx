import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import App from './App.jsx'
import './index.css'

// Unregister any service workers to prevent caching issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log('🧹 Unregistered service worker:', registration.scope);
    }
  });
}

// Disable React StrictMode in development to prevent double-rendering issues
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

if (import.meta.env.DEV) {
  // Development: No StrictMode to avoid double renders
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
} else {
  // Production: Use StrictMode
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}
