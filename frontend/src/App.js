import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginSuccess = (data) => {

    const newToken = data.token;
    const newName = data.name || "";
    const newEmail = data.email || "";

    // Save to localStorage for persistence
    localStorage.setItem("token", newToken);
    localStorage.setItem("userName", newName);
    localStorage.setItem("userEmail", newEmail);

    // Update React state
    setToken(newToken);
    setUserName(newName);
    setUserEmail(newEmail);

  };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    setToken(null);
    setUserName("");
    setUserEmail("");

  };

  return (
    <BrowserRouter>
      <div className="app-container">

        {token ? (
          <>
            <Navbar
              userName={userName}
              userEmail={userEmail}
              onLogout={handleLogout}
            />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </>
        ) : (
          isRegistering ? (
            <Register onSwitchToLogin={() => setIsRegistering(false)} />
          ) : (
            <Login onSwitchToRegister={() => setIsRegistering(true)} onLoginSuccess={handleLoginSuccess} />
          )
        )}

        <ToastContainer />
      </div>
    </BrowserRouter>
  );

}

export default App;
