import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { seedStudioContent } from './services/firestoreSeed'

if (import.meta.env.VITE_FIREBASE_AUTO_SEED === 'true') {
  void seedStudioContent().catch((error) => {
    console.warn('Firestore seed skipped:', error);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
