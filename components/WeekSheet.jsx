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

/* ===========================
   COPIA / INCOLLA (CLIPBOARD)
   =========================== */

/* Tipi "firma" per evitare incolli sbagliati */
const CLIP_TYPES = {
  DAY: "ATD_SERVIZI_DAY",
  WEEK: "ATD_SERVIZI_WEEK",
  SERVICE: "ATD_SERVIZI_SERVICE",
};

/* Scrive oggetto su clipboard come JSON */
const toClipboard = async (obj) => {
  const text = JSON.stringify(obj);

  // Prova API clipboard moderna (scrittura spesso OK anche dove lettura è bloccata)
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn("Clipboard writeText fallito, uso fallback prompt:", err);
  }

  // Fallback: prompt manuale
  window.prompt("Copia questo testo:", text);
  return false;
};

/* Legge testo dalla clipboard (se permesso dal browser)
   NOTA: La lettura è consentita solo in HTTPS/localhost e solo su gesto utente (click).
   Se il browser blocca, NON esiste un modo “magico” per leggere comunque senza UI. */
/* Legge testo dalla clipboard:
   - Prova navigator.clipboard.readText (moderno)
   - Se fallisce, prova fallback execCommand('paste') con textarea nascosta
*/
const fromClipboard = async () => {
  // 1) API moderna
  try {
    if (navigator?.clipboard?.readText) {
      const text = await navigator.clipboard.readText();
      if (String(text || "").trim()) return String(text || "");
    }
  } catch (err) {
    console.warn("readText bloccato, provo fallback execCommand:", err);
  }

  // 2) Fallback (non garantito su tutti i browser)
  try {
    const ta = document.createElement("textarea");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    ta.setAttribute("readonly", "");
    document.body.appendChild(ta);
    ta.focus();

    const ok = document.execCommand("paste");
    const text = ta.value || "";
    document.body.removeChild(ta);

    if (ok && String(text).trim()) return String(text);
  } catch (err) {
    console.warn("execCommand paste fallito:", err);
  }

  return "";
};

/* Rimuove campi che NON vogliamo copiare (id, timestamp, ecc.) */
const stripMeta = (row) => {
  const { id, createdAt, updatedAt, ...rest } = row || {};
  return rest;
};

/* ===========================
   MODAL ERRORI (solo in caso di blocco/incolla non valida)
   =========================== */

const ErrorModal = ({ open, title, body, onClose }) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
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
              <h5 className="modal-title">{title || "Attenzione"}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Chiudi"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              <p className="mb-0">{body || "Operazione non riuscita."}</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* MODAL CONFERMA ELIMINAZIONE (riga singola) */
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

/* MODAL CONFERMA SVUOTA (giorno/settimana) */
const ConfirmClearModal = ({ open, title, body, onCancel, onConfirm }) => {
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
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Chiudi"
                onClick={onCancel}
              />
            </div>

            <div className="modal-body">
              <p className="mb-0">{body}</p>
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

/* ===========================
   FORM INSERIMENTO (a scomparsa)
   =========================== */
const AddServiceFormRow = ({
  giorno,
  volontari,
  settimanaKey,
  onAdd,
  onCancel,
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

  const [form, setForm] = useState(() => emptyRow(giorno));

  const [hh = "", mm = ""] = (form.orario || "").split(":");
  const dlAutista = `dl-autista-add-${settimanaKey}-${giorno}`;
  const dlAcc = `dl-acc-add-${settimanaKey}-${giorno}`;

  const setOrario = (hour, minute) => {
    const h = hour ?? hh;
    const m = minute ?? mm;
    const nextOrario = h && m ? `${h}:${m}` : "";
    setForm((p) => ({ ...p, orario: nextOrario }));
  };

  const handleSave = async () => {
    // validazione minima: salva solo se almeno un campo è compilato
    const hasSomething = Object.entries(form)
      .filter(([k]) => !["id"].includes(k))
      .some(([, v]) => String(v || "").trim().length > 0);

    if (!hasSomething) {
      onCancel?.();
      return;
    }

    const payload = {
      giorno,
      orario: form.orario,
      servizio: form.servizio,
      localita: form.localita,
      autista: form.autista,
      accompagnatore: form.accompagnatore,
      mezzo: form.mezzo,
      fascia: getFascia(form.orario),
      settimana: settimanaKey,
    };

    await onAdd(payload);
    onCancel?.();
  };

  return (
    <tr className="table-warning">
      <td>
        {/* ORARIO (solo minuti a step 5) */}
        <div className="d-flex gap-1">
          <select
            className="form-select form-select-sm"
            value={hh}
            onChange={(e) => setOrario(e.target.value, mm || "00")}
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
            onChange={(e) => setOrario(hh || "00", e.target.value)}
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
          value={form.servizio}
          onChange={(e) => setForm((p) => ({ ...p, servizio: e.target.value }))}
          placeholder="Servizio"
        />
      </td>

      <td>
        <input
          className="form-control form-control-sm w-100"
          value={form.localita}
          onChange={(e) => setForm((p) => ({ ...p, localita: e.target.value }))}
          placeholder="Località"
        />
      </td>

      <td>
        <VolunteerSelect
          label="Autista"
          list={autistiList}
          value={form.autista}
          datalistId={dlAutista}
          onSelect={(val) => setForm((p) => ({ ...p, autista: val }))}
        />
      </td>

      <td>
        <VolunteerSelect
          label="Accompagnatore"
          list={accompagnatoriList}
          value={form.accompagnatore}
          datalistId={dlAcc}
          onSelect={(val) => setForm((p) => ({ ...p, accompagnatore: val }))}
        />
      </td>

      {/* Orario duplicato prima del mezzo */}
      <td className="text-center fw-semibold">{form.orario || "—"}</td>

      <td>
        <select
          className="form-select form-select-sm w-100"
          value={form.mezzo}
          onChange={(e) => setForm((p) => ({ ...p, mezzo: e.target.value }))}
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
        <div className="d-flex justify-content-center gap-1">
          <button
            type="button"
            className="btn btn-sm btn-success"
            onClick={handleSave}
            title="Salva"
          >
            ✅
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onCancel}
            title="Annulla"
          >
            ✖
          </button>
        </div>
      </td>
    </tr>
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

  // COPIA / INCOLLA (passate dal parent)
  onCopyDay,
  onOpenPasteDay, // incolla "giorno" (automatico)
  onClearDay, // svuota giorno
  onCopyService, // copia singolo servizio
  onOpenPasteService, // incolla singolo servizio (automatico) su questo giorno

  // gestione form add per giorno
  onToggleAddForm,
  isAddFormOpen,
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

          {/* COMANDI GIORNO (solo testo aggiornato) */}
          <div className="d-flex gap-2 flex-wrap justify-content-end">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => onCopyDay?.(giorno)}
              title="Copia i servizi di questo giorno"
            >
              Copia giorno
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-success"
              onClick={() => onOpenPasteDay?.(giorno)}
              title="Incolla i servizi su questo giorno"
            >
              Incolla giorno
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-success"
              onClick={() => onOpenPasteService?.(giorno)}
              title="Incolla un singolo servizio su questo giorno"
            >
              Incolla servizio
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => onClearDay?.(giorno)}
              title="Svuota (elimina) tutti i servizi di questo giorno"
            >
              Elimina
            </button>
          </div>
        </div>

        <div className="table-responsive sheet-scroll">
          {/* BARRA “AGGIUNGI SERVIZIO” SEMPRE IN CIMA (sticky) */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 3,
              background: "white",
              paddingBottom: "0.5rem",
            }}
          >
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => onToggleAddForm?.(giorno)}
              title="Mostra/Nascondi form inserimento"
            >
              {isAddFormOpen ? "Chiudi inserimento" : "Aggiungi servizio"}
            </button>
          </div>

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

                <th style={{ width: 90 }} className="text-center">
                  Azioni
                </th>
              </tr>
            </thead>

            <tbody>
              {/* FORM INSERIMENTO A SCOMPARSA */}
              {isAddFormOpen && (
                <AddServiceFormRow
                  giorno={giorno}
                  volontari={volontari}
                  settimanaKey={settimanaKey}
                  onAdd={onAdd}
                  onCancel={() => onToggleAddForm?.(giorno)}
                />
              )}

              {rows.map((r, idx) => {
                const fascia = r.orario ? getFascia(r.orario) : "";
                const [hh = "", mm = ""] = (r.orario || "").split(":");

                // id univoci per datalist (per riga e colonna)
                const dlAutista = `dl-autista-${settimanaKey}-${giorno}-${idx}`;
                const dlAcc = `dl-acc-${settimanaKey}-${giorno}-${idx}`;

                const saveRow = async (patch) => {
                  const next = { ...r, ...patch };

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
                  }
                };

                return (
                  <tr
                    key={r.id ?? `row-${idx}`}
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
                            saveRow({ orario: nextOrario });
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
                            saveRow({ orario: nextOrario });
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
                        onBlur={(e) => saveRow({ servizio: e.target.value })}
                        placeholder="Servizio"
                      />
                    </td>

                    <td>
                      <input
                        className="form-control form-control-sm w-100"
                        defaultValue={r.localita}
                        onBlur={(e) => saveRow({ localita: e.target.value })}
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
                        onSelect={(val) => saveRow({ autista: val })}
                      />
                    </td>

                    <td>
                      {/* ACCOMPAGNATORE con filtro iniziale cognome (input unico) */}
                      <VolunteerSelect
                        label="Accompagnatore"
                        list={accompagnatoriList}
                        value={r.accompagnatore}
                        datalistId={dlAcc}
                        onSelect={(val) => saveRow({ accompagnatore: val })}
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
                        onChange={(e) => saveRow({ mezzo: e.target.value })}
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
                        <div className="d-flex justify-content-center gap-1">
                          {/* COPIA SINGOLO SERVIZIO */}
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => onCopyService?.(r)}
                            title="Copia questo servizio"
                          >
                            📋
                          </button>

                          {/* ELIMINA SINGOLO SERVIZIO */}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => onRequestDelete(r)}
                            title="Elimina"
                          >
                            🗑
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Stato vuoto */}
          {!isAddFormOpen && (rows || []).length === 0 && (
            <div className="text-muted mt-2">
              Nessun servizio per questo giorno.
            </div>
          )}
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

  /* ===========================
     COPIA / INCOLLA: GIORNO + SETTIMANA + SERVIZIO
     =========================== */

  // Mantengo lo stato della modalità di incolla, ma NON uso più il box di incolla manuale
  const [pasteState, setPasteState] = useState({
    mode: null, // "DAY" | "WEEK" | "SERVICE"
    giornoTarget: null,
  });

  // Stato modal errori (solo se clipboard bloccata o JSON non valido)
  const [errorState, setErrorState] = useState({
    open: false,
    title: "",
    body: "",
  });

  const closeError = () => setErrorState({ open: false, title: "", body: "" });

  const showError = (title, body) => setErrorState({ open: true, title, body });

  const closePaste = () => {
    setPasteState({ mode: null, giornoTarget: null });
  };

  const copyDay = async (giorno) => {
    try {
      const rows = (byDay[giorno] || []).map(stripMeta);

      await toClipboard({
        type: CLIP_TYPES.DAY,
        giorno,
        rows,
        // info utile solo per debug/controllo
        copiedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
      showError("Errore", "Errore durante la copia del giorno");
    }
  };

  const copyWeek = async () => {
    try {
      const rows = giorniSettimana.flatMap((g) =>
        (byDay[g] || []).map(stripMeta),
      );

      await toClipboard({
        type: CLIP_TYPES.WEEK,
        rows,
        copiedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
      showError("Errore", "Errore durante la copia della settimana");
    }
  };

  const copyService = async (row) => {
    try {
      if (!row) return;
      const payload = stripMeta(row);

      await toClipboard({
        type: CLIP_TYPES.SERVICE,
        row: payload,
        copiedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
      showError("Errore", "Errore durante la copia del servizio");
    }
  };

  // Parser sicuro del testo incollato
  const safeParse = (text) => {
    try {
      return JSON.parse(String(text || "").trim());
    } catch {
      return null;
    }
  };

  const doAutoPaste = async (mode, giornoTarget) => {
    // PRIMA cosa: leggi la clipboard
    const text = await fromClipboard();

    if (!String(text || "").trim()) {
      showError(
        "Incolla non disponibile",
        "Il browser sta bloccando l'accesso automatico alla clipboard anche su localhost. Prova: Chrome senza estensioni / finestra anonima, oppure verifica che l'app non sia dentro un iframe.",
      );
      return;
    }

    // poi parse + incolla
    await handlePasteConfirm(text, { mode, giornoTarget });
  };

  const handlePasteConfirm = async (text, forcedState) => {
    const clip = safeParse(text);

    if (!clip) {
      showError("Incolla non valida", "Contenuto clipboard non valido (JSON).");
      closePaste();
      return;
    }

    // uso lo stato “forzato” se passato, altrimenti quello React (ma qui lo passo sempre)
    const mode = forcedState?.mode ?? pasteState.mode;
    const giornoTarget = forcedState?.giornoTarget ?? pasteState.giornoTarget;

    try {
      if (mode === "DAY") {
        if (clip.type !== CLIP_TYPES.DAY) {
          showError("Clipboard non valida", "Copia prima un GIORNO.");
          closePaste();
          return;
        }

        const rows = Array.isArray(clip.rows) ? clip.rows : [];

        for (const r of rows) {
          const payload = {
            ...r,
            giorno: giornoTarget,
            settimana: settimanaKey,
            fascia: getFascia(r.orario),
          };
          await onAdd(payload);
        }

        closePaste();
        return;
      }

      if (mode === "WEEK") {
        if (clip.type !== CLIP_TYPES.WEEK) {
          showError("Clipboard non valida", "Copia prima una SETTIMANA.");
          closePaste();
          return;
        }

        const rows = Array.isArray(clip.rows) ? clip.rows : [];

        for (const r of rows) {
          const payload = {
            ...r,
            settimana: settimanaKey,
            fascia: getFascia(r.orario),
          };
          await onAdd(payload);
        }

        closePaste();
        return;
      }

      if (mode === "SERVICE") {
        if (clip.type !== CLIP_TYPES.SERVICE) {
          showError("Clipboard non valida", "Copia prima un SERVIZIO.");
          closePaste();
          return;
        }

        const row = clip.row || null;

        if (!row) {
          showError("Clipboard non valida", "Servizio mancante.");
          closePaste();
          return;
        }

        const payload = {
          ...row,
          giorno: giornoTarget,
          settimana: settimanaKey,
          fascia: getFascia(row.orario),
        };

        await onAdd(payload);

        closePaste();
        return;
      }
    } catch (err) {
      console.error(err);
      showError(
        "Errore incolla",
        "Errore durante l'incolla. Controlla anche le regole Firestore.",
      );
      closePaste();
    }
  };

  /* ===========================
     SVUOTA (ELIMINA) GIORNO / SETTIMANA
     =========================== */

  const [clearState, setClearState] = useState({
    open: false,
    mode: null, // "DAY" | "WEEK"
    giorno: null,
  });

  const openClearDay = (giorno) => {
    setClearState({ open: true, mode: "DAY", giorno });
  };

  const openClearWeek = () => {
    setClearState({ open: true, mode: "WEEK", giorno: null });
  };

  const closeClear = () => {
    setClearState({ open: false, mode: null, giorno: null });
  };

  const confirmClear = async () => {
    try {
      if (clearState.mode === "DAY") {
        const giorno = clearState.giorno;
        const rows = byDay[giorno] || [];

        // Elimina tutte le righe Firestore del giorno
        for (const r of rows) {
          if (r?.id) await onDelete(r.id);
        }

        closeClear();
        return;
      }

      if (clearState.mode === "WEEK") {
        // Elimina tutte le righe Firestore della settimana
        for (const g of giorniSettimana) {
          const rows = byDay[g] || [];
          for (const r of rows) {
            if (r?.id) await onDelete(r.id);
          }
        }

        closeClear();
        return;
      }
    } catch (err) {
      console.error(err);
      showError("Errore", "Errore durante lo svuotamento");
    }
  };

  const clearTitle =
    clearState.mode === "DAY"
      ? `Svuotare ${clearState.giorno}?`
      : "Svuotare la settimana?";

  const clearBody =
    clearState.mode === "DAY"
      ? "Questa operazione eliminerà tutti i servizi del giorno selezionato (solo per questa settimana)."
      : "Questa operazione eliminerà tutti i servizi della settimana corrente (Lun–Ven).";

  /* ===========================
     gestione form add per giorno
     =========================== */
  const [openAddForDay, setOpenAddForDay] = useState(null);

  const toggleAddForm = (giorno) => {
    setOpenAddForDay((prev) => (prev === giorno ? null : giorno));
  };

  return (
    <div className="mt-4">
      {/* COPIA / INCOLLA SETTIMANA + ELIMINA SETTIMANA */}
      <div className="d-flex justify-content-end gap-2 mb-3 flex-wrap">
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={copyWeek}
          title="Copia tutti i servizi della settimana"
        >
          Copia settimana
        </button>

        <button
          type="button"
          className="btn btn-sm btn-outline-success"
          onClick={() => doAutoPaste("WEEK", null)}
          title="Incolla tutti i servizi su questa settimana"
        >
          Incolla settimana
        </button>

        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={openClearWeek}
          title="Svuota (elimina) tutti i servizi della settimana"
        >
          Elimina settimana
        </button>
      </div>

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
            onCopyDay={copyDay}
            onOpenPasteDay={(g) => doAutoPaste("DAY", g)}
            onClearDay={openClearDay}
            onCopyService={copyService}
            onOpenPasteService={(g) => doAutoPaste("SERVICE", g)}
            onToggleAddForm={toggleAddForm}
            isAddFormOpen={openAddForDay === giorno}
          />
        );
      })}

      {/* Popup custom conferma eliminazione (singola riga) */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        servizioName={deleteTarget?.servizio || servizioName}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* MODAL CONFERMA SVUOTA */}
      <ConfirmClearModal
        open={clearState.open}
        title={clearTitle}
        body={clearBody}
        onCancel={closeClear}
        onConfirm={confirmClear}
      />

      {/* MODAL ERRORI (solo se la clipboard è bloccata o contenuto errato) */}
      <ErrorModal
        open={errorState.open}
        title={errorState.title}
        body={errorState.body}
        onClose={closeError}
      />
    </div>
  );
};

export default WeekSheet;
