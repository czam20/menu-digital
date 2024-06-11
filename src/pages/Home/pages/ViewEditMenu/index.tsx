import {
  IconArrowLeft,
  IconCirclePlus,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router";
import {
  IconCup,
  IconCake,
  IconSalad,
  IconToolsKitchen,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import getAllPlates, { Plate } from "./api/get-all-plates";
import { useSnapshot } from "valtio";
import authStore from "@/store/auth";
import { useToast } from "@/components/ui/use-toast";

export const CATEGORIES = [
  {
    label: "entrada",
    icon: <IconSalad stroke={2} />,
  },
  {
    label: "principal",
    icon: <IconToolsKitchen stroke={2} />,
  },
  {
    label: "postre",
    icon: <IconCake stroke={2} />,
  },
  {
    label: "bebida",
    icon: <IconCup stroke={2} />,
  },
] as const;

function ViewEditMenu() {
  const navigate = useNavigate();
  const snapAuth = useSnapshot(authStore);
  const { toast } = useToast();
  const [plates, setPlates] = useState<Plate[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<
    "entrada" | "postre" | "principal" | "bebida"
  >(CATEGORIES[0].label);

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

  const filteredPlates = plates.filter((plate) =>
    plate.categories.includes(selectedCategory)
  );

  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-4xl">Menú</h1>
          <IconArrowLeft
            onClick={() => {
              navigate("/home");
            }}
            role="button"
            stroke={2}
          />
          <div className="flex flex-col gap-4 w-96 border p-5 rounded-md">
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  navigate("/home/owner/menu/plate/add");
                }}
                variant={"outline"}
                className="gap-2"
              >
                <IconPlus stroke={2} />
                <span className="text-sm font-semibold">Agregar Plato</span>
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <Separator />
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

                                <IconEdit
                                  role="button"
                                  stroke={2}
                                  size={17}
                                  onClick={() => {
                                    navigate(
                                      `/home/owner/menu/plate/${plate._id}`
                                    );
                                  }}
                                />
                                <IconTrash
                                  role="button"
                                  stroke={2}
                                  size={17}
                                  color="red"
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

export default ViewEditMenu;
