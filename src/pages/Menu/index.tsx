import { useParams } from "react-router";
import {
  IconCheck,
  IconEye,
  IconEyeOff,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useSnapshot } from "valtio";
import authStore from "@/store/auth";
import { useToast } from "@/components/ui/use-toast";
import getAllPlates, {
  Plate,
} from "../Home/pages/ViewEditMenu/api/get-all-plates";
import { CATEGORIES } from "../Home/pages/ViewEditMenu";
import { Button } from "@/components/ui/button";
import confirmOrder from "./api/confirm-order";
import QRCode from "react-qr-code";

export interface selectedProps extends Plate {
  quantity: number;
}

function Menu() {
  const snapAuth = useSnapshot(authStore);
  const { toast } = useToast();
  const { restaurantId } = useParams();
  const [plates, setPlates] = useState<Plate[]>([]);
  const [selectedPlates, setSelectedPlates] = useState<selectedProps[]>(() => {
    const saved = localStorage.getItem("selectedPlates");
    return saved ? JSON.parse(saved) : [];
  });

  const [orderId, setOrderId] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<
    "entrada" | "postre" | "principal" | "bebida"
  >(CATEGORIES[0].label);

  useEffect(() => {
    const getMenu = async () => {
      const resp = await getAllPlates({
        restaurantId: restaurantId ?? (snapAuth.user?.restaurant._id as string),
      });

      if (resp.ok && resp.data) {
        setPlates(resp.data.plates);
      } else {
        toast({
          variant: "destructive",
          title: "Algo salio mal al obtener los platos",
        });
      }
    };

    getMenu();
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedPlates", JSON.stringify(selectedPlates));
  }, [selectedPlates]);

  const filteredPlates = plates.filter((plate) =>
    plate.categories.includes(selectedCategory)
  );

  const handleAddPlate = (plate: Plate) => {
    const existingPlate = selectedPlates.find((p) => p._id === plate._id);
    if (existingPlate) {
      setSelectedPlates(
        selectedPlates.map((p) =>
          p._id === plate._id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedPlates([...selectedPlates, { ...plate, quantity: 1 }]);
    }
  };

  const handleRemovePlate = (plateId: string) => {
    const updatedSelectedPlates = selectedPlates.filter(
      (plate) => plate._id !== plateId
    );
    setSelectedPlates(updatedSelectedPlates);
  };

  if (orderId) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-center text-4xl">Compartir Pedido Con Mesero</h1>
        <QRCode
          className="scale-90"
          id="QRCode"
          value={window.location.host + `/waiter/order/${orderId}`}
        />

        <a
          className="hover:text-blue-400"
          href={window.location.host + `/waiter/order/${orderId}`}
          target="_blank"
        >
          {window.location.host + `/waiter/order/${orderId}`}
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-4xl">Menú</h1>
          {/* <IconArrowLeft
            onClick={() => {
              navigate("/home");
            }}
            role="button"
            stroke={2}
          /> */}
          <div className="flex flex-col gap-4 w-96 border p-5 rounded-md">
            <span className="font-semibold">Productos seleccionados</span>
            <Separator />
            {selectedPlates?.length < 1 && (
              <span className="font-semibold text-blue-300">
                No Tienes Productos seleccionados
              </span>
            )}
            {selectedPlates.map((plate: selectedProps, index: number) => (
              <div
                className="flex  gap-2 border rounded-md p-1 hover:shadow-md"
                key={plate._id ?? index}
              >
                <img
                  src={plate.photo}
                  alt="plate"
                  className="object-contain w-36 h-36 rounded-md border bg-black"
                />

                <div className="flex flex-col justify-between w-full">
                  <span className="font-bold text-md capitalize text-left">
                    {plate.name}
                  </span>
                  <span className="text-left">{plate.description}</span>
                  <input
                    type="number"
                    value={plate.quantity}
                    onChange={(e) =>
                      setSelectedPlates(
                        selectedPlates.map((p, i) =>
                          i === index
                            ? { ...p, quantity: parseInt(e.target.value) }
                            : p
                        )
                      )
                    }
                    min={1}
                    className="w-10 border-black border rounded-md text-center"
                  />
                  <div className="flex justify-between w-full items-center">
                    <span className="text-left">Precio: {plate.price}</span>
                    <div className="flex gap-2 flex-nowrap">
                      {plate.active ? (
                        <IconEye stroke={2} size={17} />
                      ) : (
                        <IconEyeOff stroke={2} size={17} />
                      )}
                      <IconTrash
                        stroke={2}
                        size={17}
                        className="cursor-pointer"
                        onClick={() => handleRemovePlate(plate._id)}
                        role="button"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {selectedPlates?.length > 0 && (
              <Button
                variant={"outline"}
                className="gap-2"
                onClick={async () => {
                  try {
                    const data = await confirmOrder({
                      restaurantId: restaurantId as string,
                      plates: JSON.stringify(selectedPlates),
                    });

                    setOrderId(data.data?.orderId as string);

                    toast({
                      title: "Pedido Creado",
                    });
                  } catch (err) {
                    toast({
                      title: "Algo salio mal",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <IconCheck stroke={2} />
                <span className="text-sm font-semibold">Confirmar Pedido</span>
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-4 w-96 border p-5 rounded-md">
            <div className="flex flex-col gap-3">
              <span className="font-semibold">Menú Preview</span>
              <Separator />
              <div className="flex flex-nowrap justify-between">
                {CATEGORIES.map((category) => {
                  return (
                    <div
                      role="button"
                      onClick={() => {
                        setSelectedCategory(category.label);
                      }}
                      className={cn(
                        "border rounded-md p-3 flex flex-col justify-center items-center gap-2 w-20 hover:bg-slate-200 hover:shadow-md transition-all",
                        {
                          ["bg-slate-300"]: selectedCategory === category.label,
                        }
                      )}
                      key={category.label}
                    >
                      <span className="capitalize font-semibold">
                        {category.label}
                      </span>
                      {category.icon}
                    </div>
                  );
                })}
              </div>

              <div>
                {filteredPlates.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {filteredPlates.map((plate) => {
                      return (
                        <div
                          className="flex  gap-2 border rounded-md p-1 hover:shadow-md"
                          key={plate._id}
                        >
                          <img
                            src={plate.photo}
                            alt="plate"
                            className="object-contain w-36 h-36 rounded-md border bg-black"
                          />

                          <div className="flex flex-col justify-between w-full">
                            <span className="font-bold text-md capitalize text-left">
                              {plate.name}
                            </span>
                            <span className="text-left">
                              {plate.description}
                            </span>
                            <div className="flex justify-between w-full items-center">
                              <span className="text-left">
                                Precio: {plate.price}
                              </span>
                              <div className="flex gap-2 flex-nowrap">
                                {plate.active ? (
                                  <IconEye stroke={2} size={17} />
                                ) : (
                                  <IconEyeOff stroke={2} size={17} />
                                )}
                                <IconPlus
                                  stroke={2}
                                  size={17}
                                  className="cursor-pointer"
                                  onClick={() => handleAddPlate(plate)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>No hay platos</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Menu;
