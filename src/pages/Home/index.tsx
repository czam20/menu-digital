import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import authStore from "@/store/auth";
import { useNavigate } from "react-router";
import { useSnapshot } from "valtio";
import QrCode from "react-qr-code";

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
  const snapAuth = useSnapshot(authStore);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center">
          <img
            className="w-20 h-20 border rounded-full"
            src={snapAuth.user?.restaurant.logo}
            alt="logo"
          />
        </div>
        <div className="flex gap-2 justify-center items-center">
          <h2 className="text-center text-4xl">
            {snapAuth.user?.restaurant.name}
          </h2>
        </div>
        <h1 className="text-center text-3xl">Propietario</h1>

        <div className="flex justify-center flex-col items-center gap-2">
          <QrCode
            className="scale-90"
            id="QRCode"
            value={
              'https://' + window.location.host + `/menu/${snapAuth.user?.restaurant._id}`
            }
          />

          <a
            className="hover:text-blue-400"
            href={
              'https://' + window.location.host + `/menu/${snapAuth.user?.restaurant._id}`
            }
            target="_blank"
          >
            {'https://' + window.location.host + `/menu/${snapAuth.user?.restaurant._id}`}
          </a>

          <Button
            variant={"outline"}
            onClick={() => {
              const svg = document.getElementById("QRCode");

              if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();
                img.onload = () => {
                  if (ctx) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const pngFile = canvas.toDataURL("image/png");
                    const downloadLink = document.createElement("a");
                    downloadLink.download = `QRCode_${snapAuth.user?.restaurant.name}`;
                    downloadLink.href = `${pngFile}`;
                    downloadLink.click();
                  }
                };
                img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
              }
            }}
          >
            Descargar QR del Menu
          </Button>
        </div>

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
            onClick={() => navigate("/home/waiter/orders")}
          >
            Pedidos
          </Button>
          <Separator />
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
  const navigate = useNavigate();

  const snapAuth = useSnapshot(authStore);
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center">
          <img
            className="w-20 h-20 border rounded-full"
            src={snapAuth.user?.restaurant.logo}
            alt="logo"
          />
        </div>
        <div className="flex gap-2 justify-center items-center">
          <h2 className="text-center text-4xl">
            {snapAuth.user?.restaurant.name}
          </h2>
        </div>
        <h1 className="text-center text-3xl">Mesero</h1>
        <div className="flex flex-col gap-4 w-96 border p-5 rounded-md">
          <Button
            variant="outline"
            onClick={() => navigate("/home/waiter/orders")}
          >
            Pedidos
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

export default Home;
