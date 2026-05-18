import { useState } from "react";
import axios from "axios";

function Register() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      const response = await axios.post(
        "https://teamtask-backend-pdvc.onrender.com/register",
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

    <div>

      <h2>Register</h2>

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

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

      <button onClick={handleRegister}>
        Register
      </button>

    </div>
  );
}

export default Register;