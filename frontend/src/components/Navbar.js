import "./Navbar.css";

function Navbar() {

  const logout = () => {

    localStorage.removeItem("token");

    window.location.reload();

  };

  return (

    <div className="navbar">

      <h2>TeamTask</h2>

      <button onClick={logout}>
        Logout
      </button>

    </div>
  );
}

export default Navbar;