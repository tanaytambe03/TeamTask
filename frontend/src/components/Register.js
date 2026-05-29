import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "https://teamtask-backend-pdvc.onrender.com";

function Register({ onSwitchToLogin }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {

    try {

      await axios.post(
        `${API_URL}/signup`,
        {
          name: name,
          email: email,
          password: password
        }
      );

      toast.success("User created successfully!");

      // Redirect to login page and pass email for auto-fill
      setTimeout(() => onSwitchToLogin(email), 1500);

    } catch (error) {

      toast.error(error.response?.data || "Registration failed. Please try again.");

    }
  };

  return (

    <div className="login-page">

      {/* LEFT COLUMN - Image */}
      <div className="login-image-col">
        <div className="login-image-overlay"></div>
        <img
          className="login-image"
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
          alt="Workspace and productivity"
        />
        <div className="login-image-text">
          <h2>Start Your Journey</h2>
          <p>Join TeamTask and streamline your team's productivity from day one.</p>
        </div>
      </div>

      {/* RIGHT COLUMN - Register Form */}
      <div className="login-form-col">
        <div className="login-form-card">
          <div className="login-header">
            <div className="login-brand">
              <img src="/Logo2.png" alt="TeamTask logo" className="login-logo-img" />
            </div>
            <p className="login-subtitle">Create your account to get started.</p>
          </div>

          <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
            <div className="input-group">
              <label htmlFor="reg-name">Name</label>
              <input
                type="text"
                id="reg-name"
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-email">Email</label>
              <input
                type="email"
                id="reg-email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="input-group password-group">
              <label htmlFor="reg-password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="reg-password"
                  name="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-btn"
            >
              Create Account
            </button>

            <p className="register-link">
              Already have an account?{' '}
              <span
                className="register-link-text"
                onClick={() => onSwitchToLogin()}
              >
                Sign in here
              </span>
            </p>
          </form>
        </div>
      </div>

    </div>

  );

}

export default Register;
