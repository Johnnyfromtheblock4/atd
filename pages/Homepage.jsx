import React, { useState } from "react";

/* GIORNI */
const giorniLavorativi = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
];

const giorniSettimana = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica",
];

/* UTILITIES */
const getFascia = (orario) => {
  const ora = parseInt(orario.split(":")[0], 10);
  return ora < 12 ? "mattina" : "pomeriggio";
};

const getLunedi = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const formatDate = (date) =>
  date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

/* COMPONENTE */
const Homepage = () => {
  const [servizi, setServizi] = useState([]);

  const [settimanaCorrente, setSettimanaCorrente] = useState(
    getLunedi(new Date())
  );

  const [form, setForm] = useState({
    giorno: "Lunedì",
    orario: "",
    servizio: "",
    localita: "",
    autista: "",
    accompagnatore: "",
    mezzo: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const aggiungiServizio = () => {
    if (!form.orario || !form.giorno) return;

    setServizi([
      ...servizi,
      {
        ...form,
        fascia: getFascia(form.orario),
        settimana: settimanaCorrente.toISOString(),
      },
    ]);

    setForm({
      ...form,
      orario: "",
      servizio: "",
      localita: "",
      autista: "",
      accompagnatore: "",
      mezzo: "",
    });
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-3">Calendario Servizi Settimanali</h1>

      {/* NAVIGAZIONE SETTIMANA */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-outline-primary"
          onClick={() =>
            setSettimanaCorrente(
              new Date(
                settimanaCorrente.setDate(settimanaCorrente.getDate() - 7)
              )
            )
          }
        >
          ⬅ Settimana precedente
        </button>

        <strong>Settimana del {formatDate(settimanaCorrente)}</strong>

        <button
          className="btn btn-outline-primary"
          onClick={() =>
            setSettimanaCorrente(
              new Date(
                settimanaCorrente.setDate(settimanaCorrente.getDate() + 7)
              )
            )
          }
        >
          Settimana successiva ➡
        </button>
      </div>

      {/* FORM INSERIMENTO */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Aggiungi servizio</h5>

          <div className="row g-2">
            <div className="col-md-2">
              <select
                className="form-select"
                name="giorno"
                value={form.giorno}
                onChange={handleChange}
              >
                {giorniLavorativi.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <input
                type="time"
                className="form-control"
                name="orario"
                min="06:00"
                max="18:00"
                value={form.orario}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                name="servizio"
                placeholder="Servizio"
                value={form.servizio}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                name="localita"
                placeholder="Località"
                value={form.localita}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                name="autista"
                placeholder="Autista"
                value={form.autista}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                name="accompagnatore"
                placeholder="Accompagnatore"
                value={form.accompagnatore}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2 mt-2">
              <select
                className="form-select"
                name="mezzo"
                value={form.mezzo}
                onChange={handleChange}
              >
                <option value="">Mezzo</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2 mt-2">
              <button
                className="btn btn-success w-100"
                onClick={aggiungiServizio}
              >
                Aggiungi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABELLA */}
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
                <td className="fw-bold text-capitalize">{fascia}</td>

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
                      .map((s, i) => (
                        <div key={i} className="border rounded p-2 mb-2">
                          <strong>⏰{s.orario}</strong>
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
    </div>
  );
};

export default Homepage;
