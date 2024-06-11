import { Input } from "@/components/ui/input";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router";
import { CATEGORIES } from "../ViewEditMenu";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type PlateForm = {
  name: string;
  description: string;
  price: string;
  ingredients: Array<string>;
  categories: Array<"entrada" | "postre" | "principal" | "bebida">;
  isRecommendation: boolean;
  photo: File | undefined;
};

function AddViewPlate() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState("");

  const form = useForm<PlateForm>({
    initialValues: {
      name: "",
      description: "",
      price: "",
      ingredients: [],
      categories: [],
      isRecommendation: false,
      photo: undefined,
    },
  });

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-4xl">
          {id ? "Editar Plato" : "Agregar Plato"}
        </h1>
        <IconArrowLeft
          onClick={() => {
            navigate("/home/owner/menu");
          }}
          role="button"
          stroke={2}
        />

        <form
          onSubmit={form.onSubmit((values) => {
            console.log(values);
          })}
          className="flex flex-col gap-4 w-96 border p-5 rounded-md"
        >
          <Input
            label="Foto"
            required
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                form.setFieldValue("photo", e.target.files[0]);
              }
            }}
          />

          <Input
            label="Nombre"
            required
            value={form.values.name}
            onChange={(e) => form.setFieldValue("name", e.target.value)}
          />

          <Input
            label="Descripcion"
            required
            value={form.values.description}
            onChange={(e) => form.setFieldValue("description", e.target.value)}
          />

          <Input
            label="Precio"
            required
            value={form.values.price}
            onChange={(e) => form.setFieldValue("price", e.target.value)}
          />

          <div className="flex flex-col gap-3">
            <Label className="font-bold font-sans text-dark-blue text-left">
              Ingredientes
            </Label>
            <div className="flex gap-2 items-center w-full">
              <Input
                placeholder="Crear ingrediente..."
                containerClassName="w-full"
                required
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
              />
              <IconPlus
                role="button"
                stroke={2}
                onClick={() => {
                  form.setFieldValue("ingredients", [
                    ...form.values.ingredients,
                    ingredient,
                  ]);
                  setIngredient("");
                }}
              />
            </div>
            <ul className="flex flex-col gap-2 items-start">
              {form.values.ingredients.map((ingr, idx) => {
                return <li className={`${ingr}-${idx}`}>- {ingr}</li>;
              })}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Label className="font-bold font-sans text-dark-blue text-left">
              Categories:
            </Label>
            <div className="flex flex-nowrap justify-between">
              {CATEGORIES.map((category) => {
                return (
                  <div
                    role="button"
                    onClick={() => {
                      const aux = [...form.values.categories];

                      if (aux.includes(category.label)) {
                        form.setFieldValue(
                          "categories",
                          aux.filter((c) => c !== category.label)
                        );
                      } else {
                        form.setFieldValue("categories", [
                          ...aux,
                          category.label,
                        ]);
                      }
                    }}
                    className={cn(
                      "border rounded-md p-3 flex flex-col justify-center items-center gap-2 w-20 hover:bg-slate-200 hover:shadow-md transition-all",
                      {
                        ["bg-slate-300"]: form.values.categories.includes(
                          category.label
                        ),
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
          </div>

          <div className="flex gap-2 my-3">
            <Checkbox
              checked={form.values.isRecommendation}
              onCheckedChange={(value) =>
                form.setFieldValue("isRecommendation", Boolean(value))
              }
            />
            <Label className="font-bold font-sans text-dark-blue text-left">
              Es una Recomendacion
            </Label>
          </div>
          <Button variant={'outline'} type="submit">Agregar Plato</Button>
        </form>
      </div>
    </div>
  );
}

export default AddViewPlate;
