import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RepoSearch({ onAdd }: { onAdd: () => void }) {
  const [repoQuery, setRepoQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ full_name: string }[]>([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (repoQuery.length > 2) fetchSuggestions(repoQuery);
      else setSuggestions([]);
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [repoQuery]);

  const fetchSuggestions = async (query: string) => {
    try {
      const res = await axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
      setSuggestions(res.data.items);
    } catch (err) {
      console.error('Error fetching suggestions', err);
    }
  };

  // const handleSelect = (fullName: string) => {
  //   setRepoQuery(fullName);
  //   setSuggestions([]);
  // };

  const handleAddRepo = async () => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.post('http://localhost:8080/api/projects', {
        full_name: repoQuery,
        owner: userId,
      });
      setRepoQuery('');
      onRepoAdded(); // оновити список проєктів
    } catch (err) {
      console.error('Error adding project', err);
    }
  };

   const handleSelect = async (fullName: string) => {
    setRepoQuery(fullName);
    setSuggestions([]);

    // Додаємо репозиторій у базу
    try {
      await axios.post('http://localhost:8080/api/projects', {
        path: fullName,
      });
      onAdd(); // після додавання оновлюємо список
    } catch (error) {
      console.error('Error adding repo to DB', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={repoQuery}
        onChange={(e) => setRepoQuery(e.target.value)}
        placeholder="owner/repo"
      />
      <button onClick={handleAddRepo}>Add</button>

      {suggestions.length > 0 && (
        <ul style={{ border: '1px solid #ccc', padding: '5px', marginTop: 4 }}>
          {suggestions.map((repo) => (
            <li key={repo.full_name} onClick={() => handleSelect(repo.full_name)} style={{ cursor: 'pointer' }}>
              {repo.full_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
