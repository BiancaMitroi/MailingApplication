import '../form.css'
import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        setError('Invalid email or password.');
        return;
      }
      const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token);
      setError('Now you are logged in.');
    } else {
      setError('No token received.');
    }
  } catch (error) {
    setError(`Server error. Please try again later: ${error.message}`);
  }
};

  return (
    <div className="login">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
export default Login;