import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import ThemeWrapper from './shared/ThemeWrapper.jsx'
import './i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeWrapper>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ThemeWrapper>
    </AuthProvider>
  </BrowserRouter>
  
)
