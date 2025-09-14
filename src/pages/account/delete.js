import { useState } from 'react';

function DeleteAccount() {
  const [error, setError] = useState('');
  
  const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login';
      return;
    }

  const handleDelete = async () => {
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://127.0.0.1:8000/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        localStorage.removeItem('authToken');
        window.location.href = '/';
      } else {
        setError('Failed to delete account.');
      }
    } catch {
      setError('Server error. Please try again later.');
    }
  };

  const handleCancel = () => {
    window.location.href = '/';
  };

  return (
    <div className="delete-account">
      <h1>Delete Account</h1>
      <p>Are you sure you want to delete your account?</p>
      <button onClick={handleDelete}>Yes</button>
      <button onClick={handleCancel}>No</button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default DeleteAccount;