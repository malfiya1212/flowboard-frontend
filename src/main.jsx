import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import App from './App.jsx'
import './index.css'

// 1. Google Configuration
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";

// 2. Microsoft Configuration
const msalConfig = new PublicClientApplication({
  auth: {
    clientId: "YOUR_MICROSOFT_CLIENT_ID_HERE",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin, // Automatically redirects back to your app
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap with Microsoft */}
    <MsalProvider instance={msalConfig}>
      {/* Wrap with Google */}
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </MsalProvider>
  </React.StrictMode>,
)