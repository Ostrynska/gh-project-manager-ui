// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
// import { useAuth } from "react-oidc-context";


// const App = () => {
//   const navigate = useNavigate();
//   const auth = useAuth();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     // Перевірка автентифікації за допомогою бекенду
//     fetch('/api/auth/status', {
//       credentials: 'include', // Включення кукі для сесії
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.isAuthenticated) {
//           setIsAuthenticated(true);
//           navigate('/home');
//         } else {
//           navigate('/');
//         }
//       })
//       .catch(() => navigate('/'));
//   }, [navigate]);

//   return (
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/home" element={isAuthenticated ? <Home /> : <div>Loading...</div>} />
//     </Routes>
//   );
// };

// const HomePage = () => {
//   const login = () => {
//     auth.signinRedirect()
//   };

//   return (
//     <div>
//       <h1>Welcome to the Login Page</h1>
//       <button onClick={login}>Login with Cognito</button>
//     </div>
//   );
// };

// const Home = () => {
//   return (
//     <div>
//       <h1>Welcome to Home Page</h1>
//     </div>
//   );
// };

// export default App;
import { useState } from 'react'
import './App.css'

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [data, setData] = useState({ "Message": "No Data" })

  const getTodos = async () => {
    try {
      const res = await fetch(apiUrl + "/todos", { credentials: 'include', });
      const data = await res.json();
      setData(data)
    }
    catch (err) {
      console.error(err);
      setData({ "Message": "Unauthenticated! Please login" })
    }
  }

const handleLogin = () => {
  fetch(apiUrl + "login", {
    credentials: 'include',
  })
    .then((res) => {
      // Перевірка на успішний статус відповіді (200-299)
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      return res.json(); // Якщо статус успішний, парсимо JSON
    })
    .then((data) => {
      // Перенаправляємо на URL Cognito для входу
      if (data.congnitoLoginURL) {
        window.location.href = data.congnitoLoginURL;
      } else {
        throw new Error('Cognito login URL not found');
      }
    })
    .catch((err) => {
      // Логування помилок
      console.error('Error during login fetch:', err);
    });
};


  return (
    <>
      <div className="card">
        {JSON.stringify(data)}
        <br />
        <button onClick={getTodos}>
          Fetch Todos
        </button>
        <br />
        <button onClick={handleLogin}>
          Login
        </button>
      </div>
    </>
  )
}

export default App
