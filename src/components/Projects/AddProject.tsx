import { Auth } from '@aws-amplify/auth';

import { useState } from 'react';

export const AddProject = () => {
  const [path, setPath] = useState('');

  const handleAddProject = async () => {
    try {
      const session = await Auth.currentSession(); // отримуємо Cognito токен
      const token = session.getIdToken().getJwtToken();

      const res = await fetch('http://localhost:3000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ path }),
      });

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error('Помилка при додаванні проєкту:', err);
    }
  };

  return (
    <div>
      <input value={path} onChange={(e) => setPath(e.target.value)} />
      <button onClick={handleAddProject}>Додати</button>
    </div>
  );
};
