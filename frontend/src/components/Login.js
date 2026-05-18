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

    localStorage.setItem(
        "token",
    response.data.token
);
window.location.reload();
} catch (error) {

  console.log(error);
}

};

  return (

    <div className="login-container">

      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <br />

      <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />

      <button onClick={handleLogin}>
          Login
      </button>

    </div>
  );
}

export default Login;