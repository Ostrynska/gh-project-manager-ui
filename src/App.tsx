// App.js

import { useAuth } from "react-oidc-context";
import Loader from "./components/Loader";
import "./App.css";
import Header from "./components/Header/Header";
import ProjectList from "./components/Projects/ProjectList";

function App() {
  const auth = useAuth();

  const signOutRedirect = () =>
  {
    const clientId = "43hqtpga5g4fgvf7rci04ht07i";
    const logoutUri = "http://localhost:5173/";
    const cognitoDomain = "https://eu-north-1pefrhk5ca.auth.eu-north-1.amazoncognito.com";
   window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <Loader />;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <>
        <Header/>
        <main id='main' className="flexbox-col">
          <section>
            <div className="user-container">
              <div >
                <p className="user-name"> <strong>Welcome back: </strong></p><p>{auth.user?.profile.email} </p>
              </div><button className='button-31' onClick={() => auth.removeUser()}>Sign out</button></div>
            <ProjectList/>
          </section>
        </main>
      </>


    );
  }

  return (
    <main>
      <section>
        <div>
          <h1>Welcome to GitHub <br/>projects CRM!</h1>
          <p>This is a simple and convenient CRM system for managing public projects on GitHub.</p>
          <p>To start using the system, please sign in with your account or register a new one.</p>
        </div>
        <button className="button-84" onClick={() => auth.signinRedirect()}>Sign in</button>
      </section>
    </main>
  );
}

export default App;