import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import Homepage from "../pages/Homepage";
import Contatti from "../pages/Contatti";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Homepage />} />
            <Route path="contatti" element={<Contatti />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
