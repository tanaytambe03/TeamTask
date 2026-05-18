import "./Login.css";
import axios from "axios";
import { useState } from "react";

function Login() {

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

    <div className="login-container">

      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button
        onClick={handleLogin}
      >

        Login

      </button>

    </div>

  );

}

export default Login;
