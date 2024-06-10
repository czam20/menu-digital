import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import OwnerRegister from "./pages/OwnerRegister";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/toaster";
import { useSnapshot } from "valtio";
import authStore from "./store/auth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import ProtectedRoutes from "./components/protected-routes";
import UnauthenticatedRoutes from "./components/unauthenticated-routes";
import { Button } from "./components/ui/button";
import Home from "./pages/Home";
import WaiterRegister from "./pages/Home/pages/WaiterRegister";

function App() {
  const snapAuth = useSnapshot(authStore);

  useEffect(() => {
    const data = localStorage.getItem("auth");

    if (data) {
      try {
        const user = JSON.parse(data);
        authStore.user = user;
      } catch (err) {
        authStore.user = null;
      }
    } else {
      authStore.user = null;
    }
  }, []);

  if (typeof snapAuth.user === "undefined") {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader2 className="h-10 w-10 animate-spin font-sans" />
      </div>
    );
  }

  console.log(snapAuth.user);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <UnauthenticatedRoutes>
                  <div className="flex gap-3">
                    <Link
                      to="/owner/register"
                      className="underline text-blue-300"
                    >
                      Registro Propietario
                    </Link>
                    <Link to="/login" className="underline text-blue-300">
                      Login
                    </Link>
                  </div>
                </UnauthenticatedRoutes>
              </>
            }
          />
          <Route
            path="/owner/register"
            element={
              <UnauthenticatedRoutes>
                <OwnerRegister />
              </UnauthenticatedRoutes>
            }
          />
          <Route
            path="home/owner/waiter/register"
            element={
              <ProtectedRoutes>
                <WaiterRegister />
              </ProtectedRoutes>
            }
          />
          <Route
            path="home/owner/menu"
            element={
              <ProtectedRoutes>
                creacion y edicion de menu del propietario
              </ProtectedRoutes>
            }
          />
          <Route
            path="/login"
            element={
              <UnauthenticatedRoutes>
                <Login />
              </UnauthenticatedRoutes>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            }
          />

          <Route path="/menu/:menuid/:plateid" element={<>detalle menu</>} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
