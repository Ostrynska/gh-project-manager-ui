import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import Auth from './Auth.tsx';
import { StrictMode } from 'react';
import { AuthProvider} from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_PefRhk5ca",
  client_id: "43hqtpga5g4fgvf7rci04ht07i",
  redirect_uri: "http://localhost:5173/", // Point to your localhost
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid phone profile",
  onSigninCallback: (_user) => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};


const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
      
    </StrictMode>,
  );
} else {
  console.error('Root element not found');
}