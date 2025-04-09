import './Welcome.css';

interface WelcomePageProps
{
  onSignIn: () => void;
}

export default function WelcomePage({ onSignIn }: WelcomePageProps) {
  return (
    <main>
      <section>
        <div className="container">
          <h1 className="welcome-title">Welcome to GitHub<br/>projects CRM!</h1>
          <p className='welcome-text'>Sign in to manage your GitHub projects.</p>
          <p className='welcome-text'>Once signed in, you can search for any public GitHub repository and add it to your dashboard.</p>
          <p className='welcome-text'>Track stars, forks, issues, and release dates in one place — without switching tabs. Stay organized, focus on what matters, and simplify your workflow with real-time data from GitHub.</p>
          <div className='welcome-btn'>
            <button className="button-84" onClick={onSignIn}>Sign in</button>
          </div>
        </div>
      </section>
    </main>
  );
}