import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import authStore from "@/store/auth";
import { useNavigate } from "react-router";
import { useSnapshot } from "valtio";

function Home() {
  const snapAuth = useSnapshot(authStore);

  if (snapAuth.user?.rol === "owner") {
    return <OwnerHome />;
  }

  if (snapAuth.user?.rol === "waiter") {
    return <WaiterHome />;
  }

  return null;
}

function OwnerHome() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-4xl">Propietario</h1>
        <div className="flex flex-col gap-4 w-96 border p-5 rounded-md">
          <Button
            variant="outline"
            onClick={() => {
              navigate("/home/owner/menu");
            }}
          >
            Editar Menú
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/home/owner/waiter/register")}
          >
            Registrar Mesero
          </Button>

          <Separator />

          <Button
            variant="outline"
            onClick={() => {
              window.localStorage.removeItem("auth");
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

function WaiterHome() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-4xl">Mesero</h1>
        <div className="flex flex-col gap-4 w-96 border p-5 rounded-md">
          <Separator />

          <Button
            variant="outline"
            onClick={() => {
              window.localStorage.removeItem("auth");
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
