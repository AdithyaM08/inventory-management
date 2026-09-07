import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">

        <Link to="/" className="nav-logo">
          Inventory Management System
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/purchase">Purchase Entry</Link>
          <Link to="/report">Report</Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;