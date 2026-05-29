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
import AdminDashboard from "./components/AdminDashboard";

function App() {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
  const [isRegistering, setIsRegistering] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState("");

  const handleLoginSuccess = (data) => {

    const newToken = data.token;
    const newName = data.name || "";
    const newEmail = data.email || "";
    const newRole = data.role || "user";

    // Save to localStorage for persistence
    localStorage.setItem("token", newToken);
    localStorage.setItem("userName", newName);
    localStorage.setItem("userEmail", newEmail);
    localStorage.setItem("userRole", newRole);

    // Update React state
    setToken(newToken);
    setUserName(newName);
    setUserEmail(newEmail);
    setUserRole(newRole);

  };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    setToken(null);
    setUserName("");
    setUserEmail("");
    setUserRole("");

  };

  return (
    <BrowserRouter>
      <div className="app-container">

        {token ? (
          <>
            <Navbar
              userName={userName}
              userEmail={userEmail}
              userRole={userRole}
              onLogout={handleLogout}
            />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </>
        ) : (
          isRegistering ? (
            <Register onSwitchToLogin={(email) => {
              setPrefilledEmail(email || "");
              setIsRegistering(false);
            }} />
          ) : (
            <Login
              prefilledEmail={prefilledEmail}
              onSwitchToRegister={() => {
                setPrefilledEmail("");
                setIsRegistering(true);
              }}
              onLoginSuccess={handleLoginSuccess}
            />
          )
        )}

        <ToastContainer />
      </div>
    </BrowserRouter>
  );

}

export default App;
