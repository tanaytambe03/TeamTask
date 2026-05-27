import "./Login.css";
import axios from "axios";
import { useState } from "react";

function Login({ onSwitchToRegister }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

        localStorage.setItem(
          "token",
          response.data.token
        );

        window.location.href = "/";

      }

      else {

        alert(
          response.data.message
        );

      }

    }

    catch (error) {

      console.log(error);

      alert(
        "Login Failed"
      );

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

          <div className="login-form">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />
            </div>

            <button
              className="login-btn"
              onClick={handleLogin}
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
          </div>
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
