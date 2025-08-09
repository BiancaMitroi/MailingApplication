function Logout() {
    fetch('http://127.0.0.1:8000/api/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('authToken')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Logout failed');
        }
        localStorage.removeItem('authToken');
    })
    .catch(error => {
        console.error('Error during logout:', error);
    });
    return (
        <div className="logout">
            <h1>Logging out...</h1>
            <p>You've been logged out successfully.</p>
        </div>
    );
}

export default Logout;