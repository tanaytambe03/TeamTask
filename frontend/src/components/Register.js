import "./Login.css";
import { useState } from "react";
import axios from "axios";

function Register({ onSwitchToLogin }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      const response = await axios.post(
        "https://teamtask-backend-pdvc.onrender.com/signup",
        {
          name: name,
          email: email,
          password: password
        }
      );

      console.log(response.data);

    } catch (error) {

      console.log(error);

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

          <div className="login-form">
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
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
                placeholder="Create a password"
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
              onClick={handleRegister}
            >
              Create Account
            </button>

            <p className="register-link">
              Already have an account?{' '}
              <span
                className="register-link-text"
                onClick={onSwitchToLogin}
              >
                Sign in here
              </span>
            </p>
          </div>
        </div>
      </div>

    </div>

  );

}

export default Register;