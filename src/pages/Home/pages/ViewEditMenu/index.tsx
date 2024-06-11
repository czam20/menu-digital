import { IconArrowLeft, IconCirclePlus, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import {
  IconCup,
  IconCake,
  IconSalad,
  IconToolsKitchen,
} from "@tabler/icons-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
  const [selectedCategory, setSelectedCategory] = useState<string>(
    CATEGORIES[0].label
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

              <div>No hay platos</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewEditMenu;
