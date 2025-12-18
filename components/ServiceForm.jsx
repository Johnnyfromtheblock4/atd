import React, { useState, useEffect } from "react";
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

const ServiceForm = ({ volontari, onSave, editingService, onCancelEdit }) => {
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

  // Reset autisti e accompagnatori
  const [formKey, setFormKey] = useState(0);

  // Stato popup di errore
  const [showErrorModal, setShowErrorModal] = useState(false);

  /* POPOLA FORM IN MODIFICA */
  useEffect(() => {
    if (editingService) {
      setForm(editingService);
      const [h, m] = editingService.orario.split(":");
      setOraSel(h);
      setMinSel(m);
      setFormKey((k) => k + 1);
    }
  }, [editingService]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* SALVA */
  const submit = () => {
    if (Object.values(form).some((v) => !v)) {
      setShowErrorModal(true);
      return;
    }

    onSave(form);

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
    setFormKey((k) => k + 1);
  };

  return (
    <>
      <div className="card mb-4">
        <div className="card-body">
          <h5>{editingService ? "Modifica servizio" : "Aggiungi servizio"}</h5>

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
            <div className="col-md-4">
              <div className="d-flex gap-2">
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
            </div>

            {/* Servizio */}
            <div className="col-md-12">
              <input
                className="form-control"
                name="servizio"
                placeholder="Servizio"
                value={form.servizio}
                onChange={handleChange}
              />
            </div>

            {/* Località */}
            <div className="col-md-12">
              <input
                className="form-control"
                name="localita"
                placeholder="Località"
                value={form.localita}
                onChange={handleChange}
              />
            </div>

            {/* Autista */}
            <div className="col-md-12">
              <VolunteerSelect
                key={`autista-${formKey}`}
                label="Autista"
                list={volontari.autisti}
                value={form.autista}
                onSelect={(v) => setForm({ ...form, autista: v })}
              />
            </div>

            {/* Accompagnatore */}
            <div className="col-md-12">
              <VolunteerSelect
                key={`accompagnatore-${formKey}`}
                label="Accompagnatore"
                list={volontari.accompagnatori}
                value={form.accompagnatore}
                onSelect={(v) => setForm({ ...form, accompagnatore: v })}
              />
            </div>

            {/* Mezzo */}
            <div className="col-md-12">
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

            {/* BOTTONI */}
            <div className="col-md-12 d-flex gap-2">
              <button className="btn btn-success" onClick={submit}>
                {editingService ? "Salva modifiche" : "Aggiungi"}
              </button>

              {editingService && (
                <button className="btn btn-secondary" onClick={onCancelEdit}>
                  Annulla
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL ERRORE VALIDAZIONE */}
      {showErrorModal && (
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
                  onClick={() => setShowErrorModal(false)}
                ></button>
              </div>

              <div className="modal-body text-center">
                <p>Compila tutti i campi prima di salvare il servizio.</p>
              </div>

              <div className="modal-footer justify-content-center">
                <button
                  className="btn btn-danger"
                  onClick={() => setShowErrorModal(false)}
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceForm;
