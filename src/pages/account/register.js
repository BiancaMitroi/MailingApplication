import '../form.css';
import validatePassword from '../../functions/validatePassword';
import checkMailAddress from '../../functions/checkMailAddress';
import '../form.css'
import { useState } from 'react'

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (email) {

       try {
        const checkResponse = await fetch(`http://127.0.0.1:8000/api/check-user?email=${encodeURIComponent(email)}`);
        const checkData = await checkResponse.json();
        console.log("checkResponse", checkData);
        if (checkResponse.ok) {
          if (checkData.exists) {
            setError('An account with this email already exists.');
            return;
          } else {
            const isValidEmail = await new Promise((resolve) => {
            checkMailAddress(email, (responseText) => {
                const response = JSON.parse(responseText);
                resolve(response.status === 'valid');
            });
            });
            if (!isValidEmail) {
            setError("Invalid mail address.");
            return;
            }
          }
        }
      } catch (error) {
        setError(`Could not check if user exists. Please try again: ${error.message}`);
        return;
      }

    } else {
      setError('');
    }

    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if(validatePassword(password) !== true) {
      setError(validatePassword(password).join(' '));
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Example register request (replace /api/register with your endpoint)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      if (!response.ok) {
        setError('Registration failed.');
        return;
      }
      setSuccess('Registration successful! You can now log in.');
      // Optionally redirect or clear form
    } catch {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="register">
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
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
          onChange={(e) => {
            setPassword(e.target.value);
            const passwordValidationResult = validatePassword(password);
            if (passwordValidationResult !== true) {
              setError(passwordValidationResult.join(' '));
              
            } else {
              setError('');
            }
          }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (e.target.value !== password) {
              setError('Passwords do not match.');
            } else {
              setError('');
            }
          }}
        />
        <button type="submit">Register</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
}

export default Register;