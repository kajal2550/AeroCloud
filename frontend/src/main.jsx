import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'

// In a real production app, you would use an environment variable for the Google Client ID.
// For the purpose of this demonstration/project, a generic/placeholder client ID is used.
// If the user wants a fully functional Google login, they should replace this with their actual Client ID.
const GOOGLE_CLIENT_ID = "655618540216-oovl6mvvg9c7uomqg469kg5ue9e30q1q.apps.googleusercontent.com"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
