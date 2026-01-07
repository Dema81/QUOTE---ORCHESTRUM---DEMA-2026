
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("React is bootstrapping...");

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("React render initiated.");
} else {
  console.error("Root element not found!");
}
