import '../form.css';
import validatePassword from '../../functions/validatePassword';
import { checkMailAddress } from '../../functions/checkMailAddress';
import { useState, useEffect } from 'react';

function Edit() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch('http://127.0.0.1:8000/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
      })
      .catch(() => setError('Failed to load profile.'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!firstName.trim()) {
      setError('First name cannot be empty.');
      return;
    }
    if (!lastName.trim()) {
      setError('Last name cannot be empty.');
      return;
    }
    if (!email.trim()) {
      setError('Email cannot be empty.');
      return;
    }

    const mailCheck = checkMailAddress(email);
    if (mailCheck.status !== 'Valid') {
      setError('Invalid mail address.');
      return;
    }

    if (password || confirmPassword) {
      if (validatePassword(password) !== true) {
        setError(validatePassword(password).join(' '));
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    try {
      const token = localStorage.getItem('authToken');
      const body = {
        firstName,
        lastName,
        email
      };
      if (password) body.password = password;

      const response = await fetch('http://127.0.0.1:8000/api/edit-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        setError('Profile update failed.');
        return;
      }
      setSuccess('Profile updated successfully!');
    } catch {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="edit-profile">
      <h1>Edit Profile</h1>
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
          placeholder="New Password (leave blank to keep current)"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Save Changes</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
}

export default Edit;