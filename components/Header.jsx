import React from "react";

const Header = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 text-center">
          <img
            src="/atd-logo.png"
            alt="Logo ATD"
            className="img-fluid"
            style={{ width: "20%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
