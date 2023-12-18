// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3001/login', { username, password });
    const token = response.data.token;

    // Store the token in localStorage
    localStorage.setItem('token', token);

    // Fetch user role or set it based on your authentication logic
    const roleResponse = await axios.get('http://localhost:3001/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const role = roleResponse.data.role;

    // Log the role to check if it's correct
    console.log('User Role:', role);

    // Store the user role in localStorage
    localStorage.setItem('userRole', role);

    // Redirect to the corresponding role-based portal
    navigate(`/${role}`);
  } catch (error) {
    console.error('Login failed', error);
  }
};

  

  return (
    <div>
      <h2>Login</h2>
      <label>Username:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default Login;
