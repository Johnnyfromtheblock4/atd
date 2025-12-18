import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const goToLogin = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Registrazione</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" required />
        </div>

        <button className="btn btn-primary w-100">Registrati</button>
      </form>
      
      {/* MODAL */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">
              <div className="modal-header justify-content-center border-0">
                <h5 className="modal-title">Registrazione</h5>
              </div>

              <div className="modal-body">
                <p className="mb-0">Registrazione avvenuta con successo</p>
              </div>

              <div className="modal-footer justify-content-center border-0">
                <button className="btn btn-success" onClick={goToLogin}>
                  Vai al login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
