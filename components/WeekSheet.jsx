import React, { useMemo, useState, useEffect } from "react";
import VolunteerSelect from "./VolunteerSelect";

/* TABELLA */
const giorniSettimana = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
];

/* UTILITIES */
const getFascia = (orario) => {
  const [hStr = "0", mStr = "0"] = (orario || "").split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const total = h * 60 + m;

  return total < 13 * 60 ? "mattina" : "pomeriggio";
};

const normalizeLunedi = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
};

const emptyRow = (giorno) => ({
  id: null,
  giorno,
  orario: "",
  servizio: "",
  localita: "",
  autista: "",
  accompagnatore: "",
  mezzo: "",
});

/* ORARIO (select ore/minuti a step 5) */
const oreOptions = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0"),
);

const minutiOptions = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0"),
);

/* MODAL CONFERMA ELIMINAZIONE */
const ConfirmDeleteModal = ({ open, servizioName, onCancel, onConfirm }) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onCancel}
        style={{ cursor: "pointer" }}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title">Conferma eliminazione</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Chiudi"
                onClick={onCancel}
              />
            </div>

            <div className="modal-body">
              <p className="mb-0">
                Sei sicuro che vuoi eliminare il{" "}
                <span className="fw-bold">"{servizioName}"</span>?
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
              >
                Annulla
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const DayBlock = ({
  giorno,
  dateLabel,
  rows,
  volontari,
  settimanaKey,
  onAdd,
  onUpdate,
  onDelete,

  // gestione modal dal parent
  onRequestDelete,
}) => {
  // Supporta sia:
  // 1) volontari = { autisti: [], accompagnatori: [] }
  // 2) volontari = [] (array unico già "flattened")
  const autistiList = Array.isArray(volontari)
    ? volontari
    : volontari?.autisti || [];

  const accompagnatoriList = Array.isArray(volontari)
    ? volontari
    : volontari?.accompagnatori || [];

  // Righe Firestore + 1 riga vuota sempre pronta
  const allRows = [...rows, emptyRow(giorno)];

  const saveRow = async (row, patch) => {
    const next = { ...row, ...patch };

    // validazione minima: salva solo se almeno un campo è compilato
    const hasSomething = Object.entries(next)
      .filter(([k]) => !["id"].includes(k))
      .some(([, v]) => String(v || "").trim().length > 0);

    if (!hasSomething) return;

    const payload = {
      giorno: next.giorno,
      orario: next.orario,
      servizio: next.servizio,
      localita: next.localita,
      autista: next.autista,
      accompagnatore: next.accompagnatore,
      mezzo: next.mezzo,
      fascia: getFascia(next.orario),
      settimana: settimanaKey,
    };

    if (next.id) {
      await onUpdate(next.id, payload);
    } else {
      await onAdd(payload);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center gap-3">
            <div className="day-vertical">{giorno}</div>
            <div>
              <div className="fw-bold">{giorno}</div>
              <small className="text-muted">{dateLabel}</small>
            </div>
          </div>
        </div>

        <div className="table-responsive sheet-scroll">
          <table className="table table-bordered align-middle mb-0 sheet-table">
            <thead className="table-dark">
              <tr>
                <th style={{ width: 160 }}>Orario</th>
                <th style={{ width: 150 }}>Servizio</th>
                <th style={{ width: 150 }}>Località</th>
                <th style={{ width: 190 }}>Autista</th>
                <th style={{ width: 220 }}>Accompagnatore</th>

                {/* Orario duplicato prima del mezzo */}
                <th style={{ width: 90 }} className="text-center">
                  Orario
                </th>

                <th style={{ width: 90 }}>Mezzo</th>

                <th style={{ width: 70 }} className="text-center">
                  Azioni
                </th>
              </tr>
            </thead>

            <tbody>
              {allRows.map((r, idx) => {
                const fascia = r.orario ? getFascia(r.orario) : "";

                const [hh = "", mm = ""] = (r.orario || "").split(":");

                // id univoci per datalist (per riga e colonna)
                const dlAutista = `dl-autista-${settimanaKey}-${giorno}-${idx}`;
                const dlAcc = `dl-acc-${settimanaKey}-${giorno}-${idx}`;

                return (
                  <tr
                    key={r.id ?? `new-${idx}`}
                    className={fascia ? `fascia-${fascia}` : ""}
                  >
                    <td>
                      {/* ORARIO (solo minuti a step 5) */}
                      <div className="d-flex gap-1">
                        <select
                          className="form-select form-select-sm"
                          value={hh}
                          onChange={(e) => {
                            const hour = e.target.value;
                            const minute = mm || "00";
                            const nextOrario =
                              hour && minute ? `${hour}:${minute}` : "";
                            saveRow(r, { orario: nextOrario });
                          }}
                        >
                          <option value="">--</option>
                          {oreOptions.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>

                        <select
                          className="form-select form-select-sm"
                          value={mm}
                          onChange={(e) => {
                            const minute = e.target.value;
                            const hour = hh || "00";
                            const nextOrario =
                              hour && minute ? `${hour}:${minute}` : "";
                            saveRow(r, { orario: nextOrario });
                          }}
                        >
                          <option value="">--</option>
                          {minutiOptions.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td>
                      <input
                        className="form-control form-control-sm w-100"
                        defaultValue={r.servizio}
                        onBlur={(e) => saveRow(r, { servizio: e.target.value })}
                        placeholder="Servizio"
                      />
                    </td>

                    <td>
                      <input
                        className="form-control form-control-sm w-100"
                        defaultValue={r.localita}
                        onBlur={(e) => saveRow(r, { localita: e.target.value })}
                        placeholder="Località"
                      />
                    </td>

                    <td>
                      {/* AUTISTA con filtro iniziale cognome (input unico) */}
                      <VolunteerSelect
                        label="Autista"
                        list={autistiList}
                        value={r.autista}
                        datalistId={dlAutista}
                        onSelect={(val) => saveRow(r, { autista: val })}
                      />
                    </td>

                    <td>
                      {/* ACCOMPAGNATORE con filtro iniziale cognome (input unico) */}
                      <VolunteerSelect
                        label="Accompagnatore"
                        list={accompagnatoriList}
                        value={r.accompagnatore}
                        datalistId={dlAcc}
                        onSelect={(val) => saveRow(r, { accompagnatore: val })}
                      />
                    </td>

                    {/* Orario duplicato prima del mezzo */}
                    <td className="text-center fw-semibold">
                      {r.orario || "—"}
                    </td>

                    <td>
                      <select
                        className="form-select form-select-sm w-100"
                        defaultValue={r.mezzo}
                        onChange={(e) => saveRow(r, { mezzo: e.target.value })}
                      >
                        <option value="">—</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={String(n)}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="text-center">
                      {r.id ? (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onRequestDelete(r)}
                          title="Elimina"
                        >
                          🗑
                        </button>
                      ) : (
                        <span className="text-muted">✍️</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const WeekSheet = ({
  servizi,
  settimanaCorrente,
  formatDate,
  volontari,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const settimanaKey = useMemo(
    () => normalizeLunedi(settimanaCorrente),
    [settimanaCorrente],
  );

  const byDay = useMemo(() => {
    const map = Object.fromEntries(giorniSettimana.map((g) => [g, []]));
    (servizi || []).forEach((s) => {
      if (!map[s.giorno]) map[s.giorno] = [];
      map[s.giorno].push(s);
    });

    // ordinamento per orario
    Object.keys(map).forEach((g) => {
      map[g].sort((a, b) => (a.orario || "").localeCompare(b.orario || ""));
    });

    return map;
  }, [servizi]);

  // Stato modal: riga selezionata per eliminazione
  const [deleteTarget, setDeleteTarget] = useState(null);

  const servizioName = (deleteTarget?.servizio || "").trim() || "servizio";

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="mt-4">
      {giorniSettimana.map((giorno, index) => {
        const d = new Date(settimanaCorrente);
        d.setDate(d.getDate() + index);

        return (
          <DayBlock
            key={giorno}
            giorno={giorno}
            dateLabel={formatDate(d)}
            rows={byDay[giorno] || []}
            volontari={volontari}
            settimanaKey={settimanaKey}
            onAdd={onAdd}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onRequestDelete={(row) => setDeleteTarget(row)}
          />
        );
      })}

      {/* Popup custom conferma eliminazione */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        servizioName={servizioName}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default WeekSheet;
