import React, { useState, useRef } from "react";
import volontari from "../data/volontari.json";

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

// Ore (00–23)
const ore = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

// Minuti (step 5)
const minuti5 = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0")
);

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

  const [searchAutista, setSearchAutista] = useState("");
  const [searchAccompagnatore, setSearchAccompagnatore] = useState("");

  const [showAutistaDropdown, setShowAutistaDropdown] = useState(false);
  const [showAccompagnatoreDropdown, setShowAccompagnatoreDropdown] =
    useState(false);

  // Ore & Minuti selezionati
  const [oraSel, setOraSel] = useState("");
  const [minSel, setMinSel] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const aggiungiServizio = () => {
    // VALIDAZIONE COMPLETA
    if (
      !form.giorno ||
      !form.orario ||
      !form.servizio ||
      !form.localita ||
      !form.autista ||
      !form.accompagnatore ||
      !form.mezzo
    ) {
      alert("Compila tutti i campi prima di aggiungere il servizio");
      return;
    }

    setServizi([
      ...servizi,
      {
        ...form,
        fascia: getFascia(form.orario),
        settimana: settimanaCorrente.toISOString(),
      },
    ]);

    // RESET FORM
    setForm({
      giorno: "Lunedì",
      orario: "",
      servizio: "",
      localita: "",
      autista: "",
      accompagnatore: "",
      mezzo: "",
    });

    // RESET RICERCHE
    setSearchAutista("");
    setSearchAccompagnatore("");

    // RESET ORA / MINUTI
    setOraSel("");
    setMinSel("");
  };

  // Ricerca autista / accompagnatore
  const filtraVolontari = (lista, query) => {
    if (!query) return [];
    return lista.filter((v) =>
      `${v.nome} ${v.cognome}`.toLowerCase().includes(query.toLowerCase())
    );
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
            {/* Giorno */}
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

            {/* Ora */}
            <div className="col-md-2">
              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  value={oraSel}
                  onChange={(e) => {
                    const h = e.target.value;
                    setOraSel(h);
                    const mm = minSel || "00";
                    setForm({ ...form, orario: h ? `${h}:${mm}` : "" });
                  }}
                >
                  <option value="">Ora</option>
                  {ore.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select"
                  value={minSel}
                  onChange={(e) => {
                    const mm = e.target.value;
                    setMinSel(mm);
                    const h = oraSel || "";
                    setForm({ ...form, orario: h ? `${h}:${mm}` : "" });
                  }}
                  disabled={!oraSel}
                >
                  <option value="">Min</option>
                  {minuti5.map((mm) => (
                    <option key={mm} value={mm}>
                      {mm}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Servizio */}
            <div className="col-md-2">
              <input
                className="form-control"
                name="servizio"
                placeholder="Servizio"
                value={form.servizio}
                onChange={handleChange}
              />
            </div>

            {/* Località */}
            <div className="col-md-2">
              <input
                className="form-control"
                name="localita"
                placeholder="Località"
                value={form.localita}
                onChange={handleChange}
              />
            </div>

            {/* Autista */}
            <div className="col-md-2 position-relative">
              <input
                className="form-control"
                placeholder="Autista"
                value={searchAutista}
                onChange={(e) => {
                  setSearchAutista(e.target.value);
                  setShowAutistaDropdown(true);
                }}
                onFocus={() => setShowAutistaDropdown(true)}
              />

              {showAutistaDropdown && searchAutista && (
                <div className="list-group position-absolute w-100 z-3">
                  {filtraVolontari(volontari.autisti, searchAutista).map(
                    (a) => (
                      <button
                        type="button"
                        key={a.id}
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          setForm({
                            ...form,
                            autista: `${a.nome} ${a.cognome}`,
                          });
                          setSearchAutista(`${a.nome} ${a.cognome}`);
                          setShowAutistaDropdown(false);
                        }}
                      >
                        {a.nome} {a.cognome}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Accompagnatore */}
            <div className="col-md-2 position-relative">
              <input
                className="form-control"
                placeholder="Accompagnatore"
                value={searchAccompagnatore}
                onChange={(e) => {
                  setSearchAccompagnatore(e.target.value);
                  setShowAccompagnatoreDropdown(true);
                }}
                onFocus={() => setShowAccompagnatoreDropdown(true)}
              />

              {showAccompagnatoreDropdown && searchAccompagnatore && (
                <div className="list-group position-absolute w-100 z-3">
                  {filtraVolontari(
                    volontari.accompagnatori,
                    searchAccompagnatore
                  ).map((a) => (
                    <button
                      type="button"
                      key={a.id}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setForm({
                          ...form,
                          accompagnatore: `${a.nome} ${a.cognome}`,
                        });
                        setSearchAccompagnatore(`${a.nome} ${a.cognome}`);
                        setShowAccompagnatoreDropdown(false);
                      }}
                    >
                      {a.nome} {a.cognome}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mezzo */}
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
    </div>
  );
};

export default Homepage;
