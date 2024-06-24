import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import getOrder from "./api/get-order";
import { useSnapshot } from "valtio";
import authStore from "@/store/auth";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES } from "../ViewEditMenu";
import { selectedProps } from "@/pages/Menu";
import {
  IconCheck,
  IconEye,
  IconEyeOff,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import getAllPlates, { Plate } from "../ViewEditMenu/api/get-all-plates";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useForm } from "@mantine/form";
import { Input } from "@/components/ui/input";
import confirmOrderWaiter from "./api/confirm-order-waiter";

function WaiterOrder() {
  const { id } = useParams();

  const { toast } = useToast();
  const [selectedPlates, setSelectedPlates] = useState<selectedProps[]>([]);
  const snapAuth = useSnapshot(authStore);
  const [step, setStep] = useState(0);
  const [client, setClient] = useState<any>({});
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  const [plates, setPlates] = useState<Plate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    "entrada" | "postre" | "principal" | "bebida"
  >(CATEGORIES[0].label);

  const filteredPlates = plates.filter((plate) =>
    plate.categories.includes(selectedCategory)
  );

  useEffect(() => {
    const getOrderDetails = async () => {
      const data = await getOrder({
        orderId: id as string,
        restaurantId: snapAuth.user?.restaurant._id as string,
      });

      if (data.ok) {
        setSelectedPlates(
          JSON.parse(data?.data?.order.platos as string) as any
        );
      } else {
        toast({
          title: "Algo salio mal",
          variant: "destructive",
        });
      }
    };

    getOrderDetails();
  }, []);

  useEffect(() => {
    const getMenu = async () => {
      const resp = await getAllPlates({
        restaurantId: snapAuth.user?.restaurant._id as string,
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

  if (selectedPlates.length === 0 || plates.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader2 className="h-10 w-10 animate-spin font-sans" />
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <h1 className="text-center text-4xl">Pedido Confirmado</h1>
      </div>
    );
  }

  if (step === 0) {
    return <ClientRegister setStep={setStep} setClient={setClient} />;
  }

  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-4xl">Pedido</h1>
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
                  const data = await confirmOrderWaiter({
                    restaurantId: snapAuth.user?.restaurant._id as string,
                    orderId: id as string,
                    plates: JSON.stringify(selectedPlates),
                    client: client.client,
                    table: Number(client.table),
                  });

                  if (data.ok) {
                    setCompleted(true);
                    setTimeout(() => {
                      navigate("/home");
                    }, 2000);

                    toast({
                      title: "Pedido Confirmado",
                    });
                  } else {
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

const ClientRegister = (props: any) => {
  const form = useForm({
    initialValues: {
      address: "",
      table: "",
      fullname: "",
      dni: "",
    },
  });

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-4xl">Registro Cliente</h1>

        <form
          className="flex flex-col gap-4 w-96 border p-5 rounded-md"
          onSubmit={form.onSubmit(async (values) => {
            const payload = {
              client: {
                fullname: values.fullname,
                dni: values.dni,
                address: values.address,
              },
              table: values.table,
            };

            props.setStep(1);
            props.setClient(payload);
          })}
        >
          <Input
            label="Número de Mesa"
            required
            value={form.values.table}
            onChange={(e) => form.setFieldValue("table", e.target.value)}
          />
          <Input
            label="Nombre Completo"
            required
            value={form.values.fullname}
            onChange={(e) => form.setFieldValue("fullname", e.target.value)}
          />

          <Input
            label="Número de Identificación"
            required
            value={form.values.dni}
            onChange={(e) => form.setFieldValue("dni", e.target.value)}
          />

          <Input
            label="Dirección"
            required
            value={form.values.address}
            onChange={(e) => form.setFieldValue("address", e.target.value)}
          />

          <Button type="submit" variant="outline">
            Registrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default WaiterOrder;
