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
  const token = localStorage.getItem("token");
  const [isRegistering, setIsRegistering] = useState(false);
  
  return (
    <BrowserRouter>
      <div className="app-container">

        {token ? (
          <>
            <Navbar />
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
            <Login onSwitchToRegister={() => setIsRegistering(true)} />
          )
        )}

        <ToastContainer />
      </div>
    </BrowserRouter>
  );
  
}

export default App;