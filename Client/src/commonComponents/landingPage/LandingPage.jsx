import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';

function LandingPage({setLoggedIn}) {
  const [loginRole, setLoginRole] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

// LandingPage.jsx

const handleLogin = async () => {
  if (!username || !password) {
    console.error('Username and password are required');
    return;
  }

  try {


    if (loginRole === 'user') {
      const response = await axios.post('http://localhost:3001/user-login', {
        username,
        password,
      });

      setLoggedIn(true);
      navigate('/user/*')

    }

    if(loginRole=='approver'){
      const response = await axios.post('http://localhost:3001/approver-login', {
      username,
      password,
    });
    setLoggedIn(true);
      navigate('/approver/*')

    }

  } catch (error) {
    console.error('Error during login:', error.message);
  }
};







  const toggleRegistrationForm = () => {
    setShowRegistration(!showRegistration);
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:3001/users', {
        name,
        department,
        username,
        password,
      });

      console.log(response.data); // Optional: Handle success message

      // After successful registration, go back to the login form
      setShowRegistration(false);
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <div className='overlay'>
      <div className='loginForm'>
        {!showRegistration && (
          <div>
            <div className='roleButtons'>
              <button onClick={() => setLoginRole('admin')}>Login as Admin</button>
              <button onClick={() => setLoginRole('approver')}>Login as Approver</button>
              <button onClick={() => setLoginRole('user')}>Login as User</button>
            </div>

            {loginRole && (
              <p>
                Role: {loginRole}
              </p>
            )}

            {loginRole === 'user' && (
              <p>
                New user? <Link to='#' onClick={toggleRegistrationForm}>Register here</Link>
              </p>
            )}

            <div className='loginFields'>
              <input type='text' placeholder='Username or Email' onChange={(e) => setUsername(e.target.value)} />
              <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
              <button onClick={handleLogin}>Login</button>
            </div>
          </div>
        )}

        {showRegistration && (
          <div className='registrationForm'>
            <input type='text' placeholder='Name' onChange={(e) => setName(e.target.value)} />
            <input type='text' placeholder='Department Name' onChange={(e) => setDepartment(e.target.value)} />
            <input type='text' placeholder='Email or Username' onChange={(e) => setUsername(e.target.value)} />
            <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignup}>Register</button>
            {loginRole && (
              <p>
                Role: {loginRole}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
