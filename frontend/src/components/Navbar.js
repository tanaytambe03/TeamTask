import "./Navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {

  const logout = () => {

    localStorage.removeItem("token");

    window.location.reload();

  };

  return (

    <nav className="navbar">

      <div className="navbar-brand">
        <img src="/Logo3.png" alt="TeamTask logo" className="navbar-logo" />
      </div>

      <div className="navbar-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Dashboard
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          About
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Contact
        </NavLink>
      </div>

      <div className="navbar-right">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

    </nav>
  );
}

export default Navbar;