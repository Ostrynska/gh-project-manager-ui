import { useEffect, useState } from 'react';
import axios from 'axios';

type Project = {
  id: number;
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  issues: number;
  created_at: number;
};

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editableProject, setEditableProject] = useState<Project | null>(null);

  // Отримуємо ID користувача з локального сховища
  const userId = localStorage.getItem('userId');

  // Функція для отримання проєктів
  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/projects');
      // Фільтруємо проекти за власником
      const filteredProjects = res.data.filter((project: Project) => project.owner === userId);
      setProjects(filteredProjects); // Зберігаємо відфільтровані проекти
    } catch (err) {
      console.error('Error fetching projects', err);
    }
  };

  useEffect(() => {
    fetchProjects(); // Отримуємо проекти після завантаження компонента
  }, []);

  // Видалення проекту
  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:4000/api/projects/${id}`);
    fetchProjects();
  };

  // Оновлення даних з GitHub
  const handleGitHubRefresh = async (id: number) => {
    try {
      await axios.put(`http://localhost:4000/api/projects/${id}`);
      const res = await axios.get<Project[]>('http://localhost:4000/api/projects');
      const updated = res.data.find((p) => p.id === id);
      if (updated) {
        setEditingId(id);
        setEditableProject(updated);
      }
    } catch (err) {
      console.error('GitHub update failed', err);
    }
  };

  // Збереження змін
  const handleSave = async () => {
    if (!editableProject) return;
    try {
      await axios.patch(`http://localhost:4000/api/projects/${editableProject.id}`, {
        name: editableProject.name,
      });
      setEditingId(null);
      setEditableProject(null);
      fetchProjects();
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Owner</th>
          <th>Name</th>
          <th>URL</th>
          <th>Stars</th>
          <th>Forks</th>
          <th>Issues</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.id}>
            <td>{p.owner}</td>
            <td>
              {editingId === p.id ? (
                <input
                  value={editableProject?.name || ''}
                  onChange={(e) =>
                    setEditableProject((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                />
              ) : (
                p.name
              )}
            </td>
            <td>
              <a href={p.url} target="_blank" rel="noreferrer">
                {p.url}
              </a>
            </td>
            <td>{p.stars}</td>
            <td>{p.forks}</td>
            <td>{p.issues}</td>
            <td>{new Date(p.created_at * 1000).toUTCString()}</td>
            <td>
              {editingId === p.id ? (
                <button onClick={handleSave}>Save</button>
              ) : (
                <button onClick={() => handleGitHubRefresh(p.id)}>Update</button>
              )}
              <button onClick={() => handleDelete(p.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
