import { useState } from "react";

/* RICERCA VOLONTARI */
const VolunteerSelect = ({ label, list, value, onSelect }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = list.filter((v) =>
    `${v.nome} ${v.cognome}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="col-md-2 position-relative">
      <input
        className="form-control"
        placeholder={label}
        value={query || value}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />

      {open && query && (
        <div className="list-group position-absolute w-100 z-3">
          {filtered.map((v) => (
            <button
              key={v.id}
              className="list-group-item list-group-item-action"
              onClick={() => {
                onSelect(`${v.nome} ${v.cognome}`);
                setQuery(`${v.nome} ${v.cognome}`);
                setOpen(false);
              }}
            >
              {v.nome} {v.cognome}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerSelect;
