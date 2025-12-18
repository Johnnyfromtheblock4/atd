import React, { useState } from "react";

/* TABELLA */
const giorniSettimana = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica",
];

const ServiceTable = ({
  servizi,
  settimanaCorrente,
  formatDate,
  onEdit,
  onDelete,
}) => {
  // Stato popup conferma eliminazione
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Apertura popup eliminazione
  const openDeleteModal = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  // Conferma eliminazione
  const confirmDelete = () => {
    if (serviceToDelete) {
      onDelete(serviceToDelete.id);
    }
    setShowDeleteModal(false);
    setServiceToDelete(null);
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Giorno</th>
              <th className="text-center">Mattina</th>
              <th className="text-center">Pomeriggio</th>
            </tr>
          </thead>

          <tbody>
            {giorniSettimana.map((giorno, index) => {
              const data = new Date(settimanaCorrente);
              data.setDate(settimanaCorrente.getDate() + index);

              // Classe riga per distinguere i giorni (feriali alternati + weekend)
              const rowClass =
                giorno === "Sabato" || giorno === "Domenica"
                  ? "giorno-weekend"
                  : index % 2 === 0
                  ? "giorno-pari"
                  : "giorno-dispari";

              return (
                <tr key={giorno} className={rowClass}>
                  {/* GIORNO */}
                  <td className="fw-bold">
                    {giorno}
                    <br />
                    <small>{formatDate(data)}</small>
                  </td>

                  {/* MATTINA */}
                  <td>
                    {servizi
                      .filter(
                        (s) =>
                          s.giorno === giorno &&
                          s.fascia === "mattina" &&
                          s.settimana === settimanaCorrente.toISOString()
                      )
                      .sort((a, b) => a.orario.localeCompare(b.orario))
                      .map((s) => (
                        <div key={s.id} className="border rounded p-2 mb-2">
                          <strong>⏰ {s.orario}</strong>
                          <br />♿ {s.servizio}
                          <br />
                          📍 {s.localita}
                          <br />
                          👨‍✈️ {s.autista}
                          <br />
                          🧑‍🤝‍🧑 {s.accompagnatore}
                          <br />
                          🚐 {s.mezzo}
                          {/* AZIONI */}
                          <div className="d-flex justify-content-end gap-2 mt-2">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => onEdit(s)}
                            >
                              Modifica
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => openDeleteModal(s)}
                            >
                              Elimina
                            </button>
                          </div>
                        </div>
                      ))}
                  </td>

                  {/* POMERIGGIO */}
                  <td>
                    {servizi
                      .filter(
                        (s) =>
                          s.giorno === giorno &&
                          s.fascia === "pomeriggio" &&
                          s.settimana === settimanaCorrente.toISOString()
                      )
                      .sort((a, b) => a.orario.localeCompare(b.orario))
                      .map((s) => (
                        <div key={s.id} className="border rounded p-2 mb-2">
                          <strong>⏰ {s.orario}</strong>
                          <br />♿ {s.servizio}
                          <br />
                          📍 {s.localita}
                          <br />
                          👨‍✈️ {s.autista}
                          <br />
                          🧑‍🤝‍🧑 {s.accompagnatore}
                          <br />
                          🚐 {s.mezzo}
                          {/* AZIONI */}
                          <div className="d-flex justify-content-end gap-2 mt-2">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => onEdit(s)}
                            >
                              Modifica
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => openDeleteModal(s)}
                            >
                              Elimina
                            </button>
                          </div>
                        </div>
                      ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL CONFERMA ELIMINAZIONE */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header justify-content-center">
                <h5 className="modal-title w-100 text-center">Attenzione</h5>
                <button
                  type="button"
                  className="btn-close position-absolute end-0 me-3"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>

              <div className="modal-body text-center">
                <p>
                  Vuoi eliminare questo servizio?
                  <br />
                  <strong>
                    {serviceToDelete?.giorno} – {serviceToDelete?.orario}
                  </strong>
                </p>
              </div>

              <div className="modal-footer justify-content-center gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Annulla
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Elimina
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceTable;
