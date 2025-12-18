import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import Homepage from "../pages/Homepage";
import MyPlan from "../pages/MyPlan";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Homepage />} />
            <Route path="planning" element={<MyPlan />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
