import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      {/* Top Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light mx-2">
        {/* Logo → Homepage */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/atd-logo.png"
            alt="Associazione Trasporto Disabili Busnago"
            height="40"
            className="d-inline-block align-top"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Homepage
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/planning">
                Planning
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
