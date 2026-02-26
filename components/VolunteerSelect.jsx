import { useMemo, useState } from "react";

/* RICERCA VOLONTARI */
const VolunteerSelect = ({ label, list, value, onSelect, datalistId }) => {
  const [query, setQuery] = useState("");

  const norm = (s) =>
    String(s || "")
      .trim()
      .toLowerCase();

  const initial = (cognome) => {
    const c = norm(cognome);
    return c ? c[0] : "";
  };

  // testo mostrato nell'input: mentre digiti usa query, altrimenti mostra value
  const displayValue = query !== "" ? query : value || "";

  // filtra SOLO se l'utente inserisce 1 lettera:
  // mostra suggerimenti solo con iniziale cognome uguale a quella lettera
  const options = useMemo(() => {
    const q = norm(query);

    // se non sto digitando, mostra tutto (così posso "scorrere" i suggerimenti nativi)
    if (!q) return list || [];

    // se ho 1 solo carattere => filtro per iniziale cognome
    if (q.length === 1) {
      return (list || []).filter((v) => initial(v.cognome) === q);
    }

    // se scrive più di 1 carattere, non imponiamo filtri "strani":
    // lasciamo che il browser suggerisca (datalist) tra le opzioni già presenti.
    return list || [];
  }, [list, query]);

  return (
    <div className="volunteer-select">
      <input
        className="form-control form-control-sm w-100"
        placeholder={label}
        list={datalistId}
        value={displayValue}
        onChange={(e) => {
          setQuery(e.target.value);
          // non salviamo ad ogni battuta: salviamo su blur o quando l'utente conferma
        }}
        onBlur={() => {
          // quando esce dal campo, salva quello che c'è (anche se non è in lista)
          onSelect(displayValue);
          setQuery(""); // torna a mostrare value controllato dal parent
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSelect(displayValue);
            setQuery("");
            e.currentTarget.blur();
          }
          if (e.key === "Escape") {
            setQuery("");
            e.currentTarget.blur();
          }
        }}
      />

      <datalist id={datalistId}>
        {options.map((v) => {
          const labelValue = `${v.nome}${v.cognome ? " " + v.cognome : ""}`;
          return <option key={v.id ?? labelValue} value={labelValue} />;
        })}
      </datalist>
    </div>
  );
};

export default VolunteerSelect;
