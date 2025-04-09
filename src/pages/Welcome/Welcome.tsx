import Footer from '../../components/Footer/Footer';
import './Welcome.css';

interface WelcomePageProps
{
  onSignIn: () => void;
}

export default function WelcomePage({ onSignIn }: WelcomePageProps) {
  return (
    <>
        <main className='main'>
            <section>
            <div className="container welcome-wrapper">
            <div className="welcome-content">
                <div className="welcome-text-block">
                <h1 className="welcome-title">
                    Welcome to GitHub projects CRM!
                </h1>
                <p className="welcome-text">
                    Sign in to manage your GitHub projects.
                    Once signed in, you can search for any public GitHub repository and add it to your dashboard.
                </p>
                <p className="welcome-text">
                    Track stars, forks, issues, and release dates in one place — without switching tabs. Stay organized, focus on what matters, and simplify your workflow with real-time data from GitHub.
                </p>
                <button className="button-84" onClick={onSignIn}>Sign in</button>
                </div>
                <div className="welcome-image-block">
                <img
                    className="welcome-image"
                    src="/src/assets/welcome.png"
                    alt="GitHub Projects CRM"
                    width={360}
                />
                </div>
            </div>
            </div>
        </section>
        </main>
        <Footer />
    </>
  );
}