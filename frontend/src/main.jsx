import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// 🚀 PWA Register module import karein
import { registerSW } from 'virtual:pwa-register'

// Service Worker ko register karne ka function
// immediate: true se ye turant background mein active ho jata hai
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Jab aap app update karoge, toh user ko ye confirm dikhega
    if (confirm('New content available. Reload to update?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('DawaKhoj is ready to work offline! 🚀');
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)