import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";

function App() {
  const token = localStorage.getItem("token");
  const [isRegistering, setIsRegistering] = useState(false);
  
  return (

    <div className="app-container">

      {/* <h1>TeamTask</h1> */}

      {
        token ? (

          <Dashboard />

        ) : (

          isRegistering ? (

            <Register />

        ) : (

            <Login />

        )
  )
}

{
  !token && (

    <button
      className="switch-button"
      onClick={() => setIsRegistering(!isRegistering)}
    >

      {
        isRegistering
          ? "Go to Login"
          : "Go to Register"
      }

    </button>

  )
}
<ToastContainer />
    </div>
  );
  

}

export default App;