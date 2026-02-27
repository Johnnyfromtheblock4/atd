/* NAVIGAZIONE SETTIMANA */
const WeekNavigator = ({
  settimanaCorrente,
  setSettimanaCorrente,
  formatDate,
}) => {
  const shiftWeek = (deltaDays) => {
    const d = new Date(settimanaCorrente);
    d.setDate(d.getDate() + deltaDays);
    setSettimanaCorrente(d);
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-4 week-nav">
      <button className="btn btn-primary" onClick={() => shiftWeek(-7)}>
        <i className="fa-solid fa-arrow-left"></i>{" "}
        <span className="btn-text">Settimana precedente</span>
      </button>

      <h5 className="text-center">
        Settimana del {formatDate(settimanaCorrente)}
      </h5>

      <button className="btn btn-primary" onClick={() => shiftWeek(+7)}>
        <span className="btn-text">Settimana successiva</span>{" "}
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default WeekNavigator;
