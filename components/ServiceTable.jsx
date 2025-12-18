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
  return (
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
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEdit(s)}
                          >
                            Modifica
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(s.id)}
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
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEdit(s)}
                          >
                            Modifica
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(s.id)}
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
  );
};

export default ServiceTable;
