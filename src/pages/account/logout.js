import useState from 'react';

function Logout() {
    const [error, setError] = useState('');

    fetch('http://127.0.0.1:8000/api/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('authToken')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            setError('Logout failed');
        }
        localStorage.removeItem('authToken');
    })
    .catch(error => {
        setError(`Logout failed: ${error.message}`);
    });
    return (
        <div className="logout">
            <h1>Logging out...</h1>
            {error ? <p className="error">{error}</p> : <p>You've been logged out successfully.</p>}
        </div>
    );
}

export default Logout;