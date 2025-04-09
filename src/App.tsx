import { useEffect, useState } from 'react';
import { useAuth } from "react-oidc-context";
import Loader from "./components/Loader";
import Header from "./components/Header/Header";
import "./App.css";

type RepoData = {
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  issues: number;
  createdAt: string;
};
import { SearchBar } from './components/Search/SearchBar';
import ProjectsTable from './components/Projects/ProjectsTable';
import WelcomePage from './pages/Welcome/Welcome';

function App() {
  const auth = useAuth();
  const ID_EMAIL = auth.user?.profile.email;

  const [input, setInput] = useState('');
  const [projectsData, setProjectsData] = useState<{ [key: string]: RepoData }>({});
useEffect(() => {
  if (auth.isAuthenticated && ID_EMAIL) {
    fetchUserProjects(ID_EMAIL);
  }
}, [auth.isAuthenticated, ID_EMAIL]);


const fetchUserProjects = async (email: string) => {
  try {
    const res = await fetch(`http://localhost:3001/api/user-projects?email=${email}`);
    const data = await res.json();
    const formatted = data.reduce((acc: any, repo: RepoData) => {
      acc[`${repo.owner}/${repo.name}`] = repo;
      return acc;
    }, {});
    setProjectsData(formatted);
  } catch (err) {
    console.error("❌ Помилка завантаження проєктів:", err);
  }
};


const fetchRepo = async (path: string) => {
  try {
    const [owner, name] = path.split('/');
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}`);
    const data = await response.json();

    const newRepo: RepoData = {
      owner: data.owner.login,
      name: data.name,
      url: data.html_url,
      stars: data.stargazers_count,
      forks: data.forks_count,
      issues: data.open_issues_count,
      createdAt: data.created_at,
    };

    const updatedData = {
      ...projectsData,
      [`${owner}/${name}`]: newRepo,
    };

    setProjectsData(updatedData); // оновлюємо стейт
    setInput('');

    // ВАЖЛИВО: надсилай саме те, що щойно зібрала
    await fetch('http://localhost:3001/api/save-projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ID_EMAIL,
        projects: Object.values(updatedData), // не projectsData!
      }),
    });
  } catch (err) {
    console.error('Помилка при додаванні репозиторію:', err);
  }
};

  const signOutRedirect = () =>
  {
    auth.removeUser();
    const clientId = "43hqtpga5g4fgvf7rci04ht07i";
    const logoutUri = "http://localhost:5173/";
    const cognitoDomain = "https://eu-north-1pefrhk5ca.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

    const handleUpdate = () =>
  {
    };

  const handleDelete = async (repo: RepoData) => {
    try {
      const res = await fetch('http://localhost:3001/api/delete-project', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ID_EMAIL,
          owner: repo.owner,
          name: repo.name,
        }),
      });

      if (!res.ok) throw new Error("Failed to delete project");

      const updated = { ...projectsData };
      delete updated[`${repo.owner}/${repo.name}`];
      setProjectsData(updated);
    } catch (err) {
      console.error("❌ Помилка видалення:", err);
    }
  };


  if (auth.isLoading) return <Loader />;
  if (auth.error) return <div>Помилка: {auth.error.message}</div>;

  if (!auth.isAuthenticated) {
    return (
      <WelcomePage onSignIn={() => auth.signinRedirect()} />
    );
  }


  return (
    <>
      <Header user={auth.user?.profile.email || ""} onClick={async () => signOutRedirect()} />
      <main className="flexbox-col">
        <section>
          <div className="container">
            <SearchBar input={input} setInput={setInput} onAdd={() => fetchRepo(input)}/></div>
        </section>
        <section>
          <div className="container">
            <h1>Projects</h1>
            <ProjectsTable projectsData={projectsData} handleUpdate={handleUpdate} handleDelete={handleDelete} />
          </div>
        </section>
      </main>
    </>
  );
}


export default App;
