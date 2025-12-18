import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mx-2">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img
          src="/atd-logo.png"
          alt="Associazione Trasporto Disabili Busnago"
          height="40"
        />
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Homepage
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/contatti">
              Contatti
            </Link>
          </li>

          {/* Bottone Login */}
          <li className="nav-item ms-3">
            <Link className="btn btn-primary" to="/login">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
