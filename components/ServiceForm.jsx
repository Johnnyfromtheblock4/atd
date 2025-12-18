import React, { useState } from "react";
import VolunteerSelect from "./VolunteerSelect";

/* GIORNI */
const giorniLavorativi = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
];

// Ore (00–23)
const ore = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

// Minuti (step 5)
const minuti5 = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0")
);

const ServiceForm = ({ volontari, onAdd }) => {
  const [form, setForm] = useState({
    giorno: "Lunedì",
    orario: "",
    servizio: "",
    localita: "",
    autista: "",
    accompagnatore: "",
    mezzo: "",
  });

  // Ore & Minuti selezionati
  const [oraSel, setOraSel] = useState("");
  const [minSel, setMinSel] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* AGGIUNGI */
  const submit = () => {
    if (Object.values(form).some((v) => !v)) {
      alert("Compila tutti i campi prima di aggiungere il servizio");
      return;
    }

    onAdd(form);

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

    setOraSel("");
    setMinSel("");
  };

  return (
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
          <div className="col-md-2 d-flex gap-2">
            <select
              className="form-select"
              value={oraSel}
              onChange={(e) => {
                const h = e.target.value;
                setOraSel(h);
                setForm({ ...form, orario: `${h}:${minSel || "00"}` });
              }}
            >
              <option value="">Ora</option>
              {ore.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>

            <select
              className="form-select"
              value={minSel}
              disabled={!oraSel}
              onChange={(e) => {
                const mm = e.target.value;
                setMinSel(mm);
                setForm({ ...form, orario: `${oraSel}:${mm}` });
              }}
            >
              <option value="">Min</option>
              {minuti5.map((mm) => (
                <option key={mm}>{mm}</option>
              ))}
            </select>
          </div>

          {/* Campi testo */}
          <input
            className="col-md-2 form-control"
            name="servizio"
            placeholder="Servizio"
            value={form.servizio}
            onChange={handleChange}
          />
          <input
            className="col-md-2 form-control"
            name="localita"
            placeholder="Località"
            value={form.localita}
            onChange={handleChange}
          />

          {/* Autista / Accompagnatore */}
          <VolunteerSelect
            label="Autista"
            list={volontari.autisti}
            value={form.autista}
            onSelect={(v) => setForm({ ...form, autista: v })}
          />

          <VolunteerSelect
            label="Accompagnatore"
            list={volontari.accompagnatori}
            value={form.accompagnatore}
            onSelect={(v) => setForm({ ...form, accompagnatore: v })}
          />

          {/* Mezzo */}
          <div className="col-md-2">
            <select
              className="form-select"
              name="mezzo"
              value={form.mezzo}
              onChange={handleChange}
            >
              <option value="">Mezzo</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <button className="btn btn-success w-100" onClick={submit}>
              Aggiungi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;
