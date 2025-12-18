/* NAVIGAZIONE SETTIMANA */
const WeekNavigator = ({ settimanaCorrente, setSettimanaCorrente, formatDate }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <button
        className="btn btn-outline-primary"
        onClick={() =>
          setSettimanaCorrente(
            new Date(settimanaCorrente.setDate(settimanaCorrente.getDate() - 7))
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
            new Date(settimanaCorrente.setDate(settimanaCorrente.getDate() + 7))
          )
        }
      >
        Settimana successiva ➡
      </button>
    </div>
  );
};

export default WeekNavigator;
