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

const ServiceTable = ({ servizi, settimanaCorrente, formatDate }) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Fascia</th>
            {giorniSettimana.map((giorno, index) => {
              const data = new Date(settimanaCorrente);
              data.setDate(settimanaCorrente.getDate() + index);
              return (
                <th key={giorno} className="text-center">
                  {giorno}
                  <br />
                  <small>{formatDate(data)}</small>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {["mattina", "pomeriggio"].map((fascia) => (
            <tr key={fascia}>
              <td className="fw-bold">{fascia}</td>

              {giorniSettimana.map((giorno) => (
                <td key={giorno}>
                  {servizi
                    .filter(
                      (s) =>
                        s.giorno === giorno &&
                        s.fascia === fascia &&
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
                      </div>
                    ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;
