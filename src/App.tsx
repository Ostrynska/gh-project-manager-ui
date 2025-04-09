import { useEffect, useState } from 'react';
import { useAuth } from "react-oidc-context";
import { ToastContainer, Bounce, toast } from 'react-toastify';
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
  const [sortKey, setSortKey] = useState<keyof RepoData | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedProjects = Object.values(projectsData).sort((a, b) => {
    if (!sortKey) return 0;

    const valA = a[sortKey];
    const valB = b[sortKey];

    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }

    return sortOrder === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

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

    if (!response.ok) {
      if (response.status === 404) {
        toast.error("Repository not found or it may be private.");
      } else {
        toast.error("Something went wrong while fetching the repository.");
      }
      return;
    }

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

    setProjectsData(updatedData);
    setInput('');

    await fetch('http://localhost:3001/api/save-projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ID_EMAIL,
        projects: Object.values(updatedData),
      }),
    });
  } catch (err) {
    console.error('❌ Помилка при додаванні репозиторію:', err);
    toast.error("Unexpected error occurred.");
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

const handleUpdate = async (repo: RepoData) => {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}`);
    const data = await response.json();

    const updatedRepo: RepoData = {
      owner: data.owner.login,
      name: data.name,
      url: data.html_url,
      stars: data.stargazers_count,
      forks: data.forks_count,
      issues: data.open_issues_count,
      createdAt: data.created_at,
    };

    const updated = {
      ...projectsData,
      [`${repo.owner}/${repo.name}`]: updatedRepo,
    };

    setProjectsData(updated);

    await fetch('http://localhost:3001/api/save-projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ID_EMAIL,
        projects: Object.values(updated),
      }),
    });
  } catch (err) {
    console.error("❌ Помилка оновлення репозиторію:", err);
  }
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
        <div className="container">
            <SearchBar input={input} setInput={setInput} onAdd={() => fetchRepo(input)}/></div>
        <section>
          <div className="container">
            <h1>Projects</h1>
            {sortedProjects.length > 0 ? (
                  <ProjectsTable
                    projectsData={sortedProjects}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                    onSort={(key) => {
                      if (sortKey === key) {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortKey(key);
                        setSortOrder("asc");
                      }
                    }}
                    currentSort={{ key: sortKey, order: sortOrder }}
                  />
                ) : (
                    <p className="empty-state">
                    You have no projects yet. Start by adding a GitHub repository above.
                    </p>
                )}
          </div>
        </section>
      </main>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
/>
    </>
  );
}


export default App;
