import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  /* ASCOLTA STATO AUTENTICAZIONE */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  /* LOGOUT */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Errore durante il logout");
    }
  };

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

          {/* LOGIN / USER */}
          {user ? (
            <li className="nav-item dropdown ms-3">
              <button
                className="btn btn-primary dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {user.email}
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          ) : (
            <li className="nav-item ms-3">
              <Link className="btn btn-primary" to="/login">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
