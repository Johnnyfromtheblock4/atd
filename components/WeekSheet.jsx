import React, { useMemo } from "react";

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
  const ora = parseInt(orario?.split(":")?.[0] || "0", 10);
  return ora <= 13 ? "mattina" : "pomeriggio";
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

const DayBlock = ({
  giorno,
  dateLabel,
  rows,
  volontari,
  settimanaKey,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const autistiList = volontari?.autisti || [];
  const accompagnatoriList = volontari?.accompagnatori || [];

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
                <th style={{ width: 120 }}>Orario</th>
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

                return (
                  <tr
                    key={r.id ?? `new-${idx}`}
                    className={fascia ? `fascia-${fascia}` : ""}
                  >
                    <td>
                      <input
                        type="time"
                        className="form-control form-control-sm w-100"
                        defaultValue={r.orario}
                        onBlur={(e) => saveRow(r, { orario: e.target.value })}
                      />
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
                      <select
                        className="form-select form-select-sm w-100"
                        defaultValue={r.autista}
                        onChange={(e) =>
                          saveRow(r, { autista: e.target.value })
                        }
                      >
                        <option value="">—</option>
                        {autistiList.map((a) => {
                          const label = `${a.nome}${
                            a.cognome ? " " + a.cognome : ""
                          }`;
                          return (
                            <option key={a.id} value={label}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                    </td>

                    <td>
                      <select
                        className="form-select form-select-sm w-100"
                        defaultValue={r.accompagnatore}
                        onChange={(e) =>
                          saveRow(r, { accompagnatore: e.target.value })
                        }
                      >
                        <option value="">—</option>
                        {accompagnatoriList.map((a) => {
                          const label = `${a.nome}${
                            a.cognome ? " " + a.cognome : ""
                          }`;
                          return (
                            <option key={a.id} value={label}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
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
                          onClick={() => onDelete(r.id)}
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
          />
        );
      })}
    </div>
  );
};

export default WeekSheet;
