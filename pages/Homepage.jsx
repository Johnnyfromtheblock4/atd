import React, { useState } from "react";

const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"];

const getFascia = (orario) => {
  const ora = parseInt(orario.split(":")[0], 10);
  return ora < 12 ? "mattina" : "pomeriggio";
};

const Homepage = () => {
  const [servizi, setServizi] = useState([]);

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
      <h1 className="text-center mb-4">Calendario Servizi Settimanali</h1>

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
                {giorni.map((g) => (
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
              <input
                className="form-control"
                name="mezzo"
                placeholder="Mezzo"
                value={form.mezzo}
                onChange={handleChange}
              />
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
              {giorni.map((g) => (
                <th key={g}>{g}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {["mattina", "pomeriggio"].map((fascia) => (
              <tr key={fascia}>
                <td className="fw-bold text-capitalize">{fascia}</td>

                {giorni.map((giorno) => (
                  <td key={giorno}>
                    {servizi
                      .filter((s) => s.giorno === giorno && s.fascia === fascia)
                      .map((s, i) => (
                        <div key={i} className="border rounded p-2 mb-2">
                          <strong>{s.orario}</strong>
                          <br />
                          {s.servizio}
                          <br />
                          {s.localita}
                          <br />
                          🚐 {s.mezzo}
                          <br />
                          👨‍✈️ {s.autista}
                          <br />
                          🧑‍🤝‍🧑 {s.accompagnatore}
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
