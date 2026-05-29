import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function Navbar({ userName, userEmail, userRole, onLogout }) {

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (

    <nav className="navbar">

      <div className="navbar-brand">
        <img src="/Logo3.png" alt="TeamTask logo" className="navbar-logo" />
      </div>

      {/* Desktop links */}
      <div className="navbar-links navbar-links-desktop">
        {userRole === "admin" && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Admin
          </NavLink>
        )}
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Dashboard
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          About
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Contact
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          💬 Chat
        </NavLink>
      </div>

      <div className="navbar-right">
        {(userName || userEmail) && (
          <div className={`user-info${userRole === "admin" ? " user-info--admin" : ""}`}>
            <span className="user-avatar">
              {(userName || userEmail).charAt(0).toUpperCase()}
            </span>
            <span className="user-email">{userEmail || userName}</span>
          </div>
        )}
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>

        {/* Hamburger toggle */}
        <button
          className={`hamburger-btn ${menuOpen ? "hamburger-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

      {/* Mobile slide-in menu */}
      <div className={`mobile-menu-overlay ${menuOpen ? "overlay-visible" : ""}`} onClick={closeMenu} />

      <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
        <div className="mobile-menu-header">
          <img src="/Logo3.png" alt="TeamTask" className="mobile-menu-logo" />
          <button className="mobile-menu-close" onClick={closeMenu} aria-label="Close menu">
            ✕
          </button>
        </div>

        <div className="mobile-nav-links">
          {userRole === "admin" && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? "mobile-nav-link active" : "mobile-nav-link"} onClick={closeMenu}>
              ⚙️ Admin
            </NavLink>
          )}
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "mobile-nav-link active" : "mobile-nav-link"} onClick={closeMenu}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "mobile-nav-link active" : "mobile-nav-link"} onClick={closeMenu}>
            ℹ️ About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "mobile-nav-link active" : "mobile-nav-link"} onClick={closeMenu}>
            📧 Contact
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => isActive ? "mobile-nav-link active" : "mobile-nav-link"} onClick={closeMenu}>
            💬 Chat
          </NavLink>
        </div>

        <div className="mobile-menu-footer">
          <div className="mobile-user-info">
            <span className="mobile-user-avatar">
              {(userName || userEmail).charAt(0).toUpperCase()}
            </span>
            <span className="mobile-user-email">{userEmail || userName}</span>
          </div>
          <button className="mobile-logout-btn" onClick={() => { closeMenu(); onLogout(); }}>
            Logout
          </button>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;