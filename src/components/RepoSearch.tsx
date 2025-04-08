import { useState, useEffect } from 'react';
import axios from 'axios';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export default function RepoSearch() {
  const [repoQuery, setRepoQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ full_name: string }[]>([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (repoQuery.length > 2) {
        fetchSuggestions(repoQuery);
      } else {
        setSuggestions([]);
      }
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [repoQuery]);

const fetchSuggestions = async (query: string) => {
  try {
    const res = await axios.get(
      `https://api.github.com/search/repositories?q=${query}&per_page=5`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`, // Додаємо токен
        },
      }
    );
    setSuggestions(res.data.items);
  } catch (err) {
    console.error('Error fetching suggestions', err);
  }
};


  const handleSelect = (fullName: string) => {
    setRepoQuery(fullName); // заповнює поле
    setSuggestions([]);
  };

  return (
    <div>
      <input
        type="text"
        value={repoQuery}
        onChange={(e) => setRepoQuery(e.target.value)}
        placeholder="owner/repo"
      />
      {suggestions.length > 0 && (
        <ul style={{ border: '1px solid #ccc', padding: '5px', marginTop: 4 }}>
          {suggestions.map((repo) => (
            <li
              key={repo.full_name}
              onClick={() => handleSelect(repo.full_name)}
              style={{ cursor: 'pointer', padding: '4px 0' }}
            >
              {repo.full_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
