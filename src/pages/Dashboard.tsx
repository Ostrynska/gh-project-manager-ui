import { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectList from '../components/Projects/ProjectList';

interface DashboardProps {
  onSignOut: () => void;
}

export default function Dashboard({ onSignOut }: DashboardProps) {
  const [repoQuery, setRepoQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ full_name: string }[]>([]);

  // 🔍 автопідказка з GitHub
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (repoQuery.length > 2) {
        fetchSuggestions(repoQuery);
      } else {
        setSuggestions([]);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [repoQuery]);

  const fetchSuggestions = async (query: string) => {
    try {
      const res = await axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
      setSuggestions(res.data.items);
    } catch (err) {
      console.error('Suggestion error:', err);
    }
  };

  const handleSelect = (fullName: string) => {
    setRepoQuery(fullName);
    setSuggestions([]);
  };

  const handleAdd = async () => {
    if (!repoQuery.includes('/')) {
      alert('Please enter or select a valid owner/repo');
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/projects', { path: repoQuery });
      setRepoQuery('');
    } catch (error) {
      console.error('Error adding repo', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={onSignOut}>Sign out</button>

      <div style={{ maxWidth: '300px', marginBottom: '1rem', position: 'relative' }}>
        <input
          type="text"
          value={repoQuery}
          onChange={(e) => setRepoQuery(e.target.value)}
          placeholder="owner/repo"
          style={{ width: '100%', padding: '8px' }}
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: '5px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              position: 'absolute',
              zIndex: 10,
              width: '100%',
            }}
          >
            {suggestions.map((s) => (
              <li
                key={s.full_name}
                onClick={() => handleSelect(s.full_name)}
                style={{ padding: '4px', cursor: 'pointer' }}
              >
                {s.full_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleAdd}>Add Repository</button>

      <ProjectList />
    </div>
  );
}

