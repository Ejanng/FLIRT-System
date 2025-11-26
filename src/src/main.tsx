import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '../styles/globals.css'

// Get root element
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find the root element. Make sure your index.html has a div with id="root"')
}

// Create React root and render the app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Log app initialization (development only)
if (import.meta.env.DEV) {
  console.log('🚀 FLIRT App initialized')
  console.log('📱 Mobile-first responsive design enabled')
  console.log('🎨 Muted blue theme: #5B8FB9')
}
