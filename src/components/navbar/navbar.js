import './navbar.css';

function Navbar() {
  return (
    <nav className="navbar"> 
      <div className="navbar-brand">
        <a href="/">MyApp</a>
      </div>
      <ul className="navbar-menu">
        <li><a href="/login">Login</a></li>
        <li><a href="/register">Register</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;