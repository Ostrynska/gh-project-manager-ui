import React, { useEffect, useState } from 'react';
import { useAuth } from "react-oidc-context";
import Loader from "./components/Loader";
import Header from "./components/Header/Header";
import "./App.css";

interface RepoData {
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  issues: number;
  createdAt: number;
}
const cellStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left' as const,
  verticalAlign: 'top' as const,
};

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
      createdAt: Date.parse(data.created_at),
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


  if (auth.isLoading) return <Loader />;
  if (auth.error) return <div>Помилка: {auth.error.message}</div>;

  if (!auth.isAuthenticated) {
    return (
      <main>
        <h1>Welcome to GitHub projects CRM!</h1>
        <p>Sign in to manage your GitHub projects</p>
        <button className="button-84" onClick={() => auth.signinRedirect()}>Sign in</button>
      </main>
    );
  }


  return (
    <>
      <Header user={auth.user?.profile.email || ""} onClick={() => auth.removeUser()} />
      <main className="flexbox-col">
        <section style={{ maxWidth: 500, margin: 'auto' }}>
          <h2>Projects</h2>
          <input
            type="text"
            placeholder="facebook/react"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ padding: 8, width: '100%', marginBottom: 8 }}
          />
          <button onClick={() => fetchRepo(input)} style={{ padding: 8, marginBottom: 16 }}>
            Додати
          </button>
        </section>

        <section>
<table style={{ width: '100%', maxWidth: 800, margin: 'auto', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th style={cellStyle}>Власник</th>
      <th style={cellStyle}>Назва</th>
      <th style={cellStyle}>URL</th>
      <th style={cellStyle}>Зірки</th>
      <th style={cellStyle}>Форки</th>
      <th style={cellStyle}>Issues</th>
      <th style={cellStyle}>Створено</th>
      <th style={cellStyle}>Дії</th>
    </tr>
  </thead>
  <tbody>
    {Object.values(projectsData).map((repo, index) => (
      <tr key={index}>
        <td style={cellStyle}>{repo.owner}</td>
        <td style={cellStyle}>{repo.name}</td>
        <td style={cellStyle}>
          <a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.url}</a>
        </td>
        <td style={cellStyle}>{repo.stars}</td>
        <td style={cellStyle}>{repo.forks}</td>
        <td style={cellStyle}>{repo.issues}</td>
        <td style={cellStyle}>{repo.createdAt}</td>
        <td style={cellStyle}>
          {/* <button onClick={() => handleUpdate(repo)}>Оновити</button>{' '}
          <button onClick={() => handleDelete(repo)}>Видалити</button> */}
        </td>
      </tr>
    ))}
  </tbody>
</table>
        </section>
      </main>
    </>
  );
}


export default App;
