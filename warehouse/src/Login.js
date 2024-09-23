import React, { useState } from 'react';
import './css/Login.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // FOR LOGGING IN
  const handleLogin = async (e) => {
    e.preventDefault();

    //placeholder
  };

  // FOR REGISTERING NEW ACCOUNTS
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost:7271/api/UserAccount/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Registration failed.');
      }
      
      const data = await response.json();
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during registration');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="input">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(i) => setUsername(i.target.value)}
              required
            />
          </div>
          <div className="input">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(i) => setPassword(i.target.value)}
              required
            />
          </div>
          <button type="submit"className='login-button'>{isLogin ? 'Login' : 'Register'}</button> {/* Show Login or Register button */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
        <p>
          <a href="#!" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register New Account' : 'Login'}
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
