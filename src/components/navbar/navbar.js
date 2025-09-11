import './navbar.css';

function Navbar() {
  return (
    <nav className="navbar"> 
      <div className="navbar-brand">
        <a href="/">MyApp</a>
      </div>
      <ul className="navbar-menu">
        <li>
          <select
            defaultValue=""
            onChange={e => {
              const url = e.target.value;
              if (url) window.location.href = url;
            }}
          >
            <option value="" disabled>Account</option>
            <option value="/login">Login</option>
            <option value="/logout">Logout</option>
            <option value="/register">Register</option>
            <option value="/edit">Edit profile</option>
            <option value="/delete">Delete account</option>
          </select>
        </li>
        <li><a href="/check">Check</a></li>
        <li><a href="/send">Send</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;