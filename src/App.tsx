// App.js

import { useAuth } from "react-oidc-context";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "4jv9mce2p6q6f6mkanobk6hhlt";
    const logoutUri = "http://localhost:5174";
    const cognitoDomain = "https://eu-north-1vstzqrh3p.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      // Зберігаємо ID користувача в localStorage
      localStorage.setItem('userId', auth.user?.access_token); // або auth.user.id, залежно від того, як саме зберігається ID
    }
  }, [auth.isAuthenticated, auth.user]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }


  if (auth.isAuthenticated) {
    return (
      <Dashboard onSignOut={() => { auth.removeUser(); signOutRedirect(); }} />
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
}

export default App;
