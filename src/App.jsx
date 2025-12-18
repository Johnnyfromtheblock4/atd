import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import Homepage from "../pages/Homepage";
import Contatti from "../pages/Contatti";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Homepage />} />
            <Route path="contatti" element={<Contatti />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="registrati" element={<RegisterPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
