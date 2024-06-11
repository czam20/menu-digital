import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
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
import ViewEditMenu from "./pages/Home/pages/ViewEditMenu";
import AddViewPlate from "./pages/Home/pages/AddViewPlate";

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
            path="/login"
            element={
              <UnauthenticatedRoutes>
                <Login />
              </UnauthenticatedRoutes>
            }
          />

          <Route
            path="home"
            element={
              <ProtectedRoutes>
                <Outlet />
              </ProtectedRoutes>
            }
          >
            <Route index path="" element={<Home />} />
            <Route path="owner">
              <Route path="waiter/register" element={<WaiterRegister />} />
              <Route path="menu">
                <Route index path="" element={<ViewEditMenu />} />
                <Route path="plate/add" element={<AddViewPlate />} />
                <Route path="plate/:id" element={<AddViewPlate />} />
              </Route>
            </Route>
          </Route>

          <Route path="/menu/:menuid/:plateid" element={<>detalle menu</>} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
