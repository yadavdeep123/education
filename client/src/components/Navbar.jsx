import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const user = getUser();
  const [isOpen, setIsOpen] = useState(false);

  const onLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={closeMenu}>SkillClass</Link>
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          Menu
        </button>
        <nav className={`menu ${isOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
          {user?.role === "instructor" && <Link to="/create-course" onClick={closeMenu}>Create Course</Link>}
          {!user && <Link to="/login" onClick={closeMenu}>Login</Link>}
          {!user && <Link to="/register" onClick={closeMenu}>Register</Link>}
          {user && <button onClick={onLogout}>Logout</button>}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
