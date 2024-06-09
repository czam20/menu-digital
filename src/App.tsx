import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import OwnerRegister from "./pages/OwnerRegister";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="flex gap-3">
                <Link to="/owner/register" className="underline text-blue-300">
                  Registro Propietario
                </Link>
                <Link to="/login" className="underline text-blue-300">
                  Login
                </Link>
              </div>
            </>
          }
        />
        <Route path="/owner/register" element={<OwnerRegister />} />
        <Route
          path="/owner/waiter/register"
          element={<>registro de meseros por propietario</>}
        />
        <Route
          path="/owner/menu"
          element={<>creacion y edicion de menu del propietario</>}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/waiter" element={<>home mesero</>} />
        <Route path="/menu/:menuid/:plateid" element={<>detalle menu</>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
