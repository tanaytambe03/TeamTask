import "./Login.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
                                                                                
function Login({ onSwitchToRegister, onLoginSuccess, prefilledEmail }) {

  const [email, setEmail] = useState(prefilledEmail || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {

    try {

      const response = await axios.post(
        "https://teamtask-backend-pdvc.onrender.com/login",
        {
          email: email,
          password: password
        }
      );

      console.log(response.data);

      if (response.data.token) {

        toast.success("Login successful! Welcome back.");

        // Pass login data to App.js which updates state + localStorage
        onLoginSuccess({
          token: response.data.token,
          name: response.data.name || "",
          email: response.data.email || email,
          role: response.data.role || "user"
        });

      }

      else {

        toast.error(response.data.message || "Login failed");

      }

    }

    catch (error) {

      console.log(error);

      toast.error(error.response?.data || "Login failed. Please try again.");

    }

  };

  return (

    <div className="login-page login-page--login">

      {/* LEFT COLUMN - Login Form */}
      <div className="login-form-col">
        <div className="login-form-card">
          <div className="login-header">
            <div className="login-brand">
              <img src="/Logo2.png" alt="TeamTask logo" className="login-logo-img" />
            </div>
            <p className="login-subtitle">Welcome back! Sign in to continue.</p>
          </div>

          <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="input-group">
              <label htmlFor="login-email">Email</label>
              <input
                type="email"
                id="login-email"
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
              <label htmlFor="login-password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  name="password"
                  placeholder="Enter your password"
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
              Sign In
            </button>

            <p className="register-link">
              Don't have an account?{' '}
              <span
                className="register-link-text"
                onClick={onSwitchToRegister}
              >
                Create one here
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN - Image */}
      <div className="login-image-col">
        <div className="login-image-overlay"></div>
        <img
          className="login-image"
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
          alt="Team collaboration"
        />
        <div className="login-image-text">
          <h2>Collaborate &amp; Conquer</h2>
          <p>Manage your team tasks efficiently and get things done together.</p>
        </div>
      </div>

    </div>

  );

}

export default Login;
