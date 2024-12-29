import { useState } from 'react';
import axios from 'axios';

const Register = ({ apiBaseUrl, onLoginSuccess, showAlert }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post(`${apiBaseUrl}/api/register`, {
        username,
        password,
        full_name: fullName || null
      });
      showAlert('Registration successful!', 'success');

      const response = await axios.post(
        `${apiBaseUrl}/api/login`,
        new URLSearchParams({
          username,
          password,
          grant_type: 'password',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      onLoginSuccess(response.data.access_token);
      showAlert('Login successful!', 'success');
    } catch (error) {
      let errorMessage = 'Unknown error occurred';
      const errorDetail = error.response?.data?.detail;

      if (typeof errorDetail === 'string') {
        errorMessage = errorDetail;
      } else if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail
          .map(err => `${err.loc[1]}: ${err.msg}`)
          .join('; ');
      }

      console.log(errorMessage)
      showAlert(`Error during registration: ${errorMessage}`, 'error');
    }
  };

  return (
    <div className='register'>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Full Name (optional)"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
