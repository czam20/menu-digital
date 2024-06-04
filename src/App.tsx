import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><span className="bg-black text-white">home 2</span></>} />
        <Route path="/owner/register" element={<>registro propietario</>} />
        <Route
          path="/owner/waiter/register"
          element={<>registro de meseros por propietario</>}
        />
        <Route
          path="/owner/menu"
          element={<>creacion y edicion de menu del propietario</>}
        />
        <Route path="/login" element={<>login</>} />
        <Route path="/waiter" element={<>home mesero</>} />
        <Route path="/menu/:menuid/:plateid" element={<>detalle menu</>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
