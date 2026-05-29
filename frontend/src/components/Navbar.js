import "./Navbar.css";
import { NavLink } from "react-router-dom";

function Navbar({ userName, userEmail, onLogout }) {

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
        {(userName || userEmail) && (
          <div className="user-info">
            <span className="user-avatar">
              {(userName || userEmail).charAt(0).toUpperCase()}
            </span>
            <span className="user-email">{userEmail || userName}</span>
          </div>
        )}
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

    </nav>
  );
}

export default Navbar;