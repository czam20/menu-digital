import { Input } from "@/components/ui/input";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router";
import { CATEGORIES } from "../ViewEditMenu";
import { cn, uploadImage } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import addUpdatePlate from "./api/add-update-plate";
import { useToast } from "@/components/ui/use-toast";
import { useSnapshot } from "valtio";
import authStore from "@/store/auth";
import getPlate from "./api/get-plate";

type PlateForm = {
  name: string;
  description: string;
  price: string;
  ingredients: Array<string>;
  categories: Array<"entrada" | "postre" | "principal" | "bebida">;
  isRecommendation: boolean;
  active: boolean;
  photo: File | undefined;
};

function AddViewPlate() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const { toast } = useToast();
  const snapAuth = useSnapshot(authStore);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<PlateForm>({
    initialValues: {
      name: "",
      description: "",
      price: "",
      ingredients: [],
      categories: [],
      isRecommendation: false,
      active: true,
      photo: undefined,
    },
  });

  useEffect(() => {
    const getInfo = async () => {
      const resp = await getPlate({
        restaurantId: snapAuth.user?.restaurant._id as string,
        plateId: id as string,
      });

      if (resp.ok && resp.data) {
        console.log(resp.data.plate);

        form.setFieldValue("name", resp.data.plate.name);
        form.setFieldValue("description", resp.data.plate.description);
        form.setFieldValue("price", resp.data.plate.price.toString());
        form.setFieldValue("ingredients", resp.data.plate.ingredients);
        form.setFieldValue("categories", resp.data.plate.categories);
        form.setFieldValue(
          "isRecommendation",
          resp.data.plate.isRecommendation
        );
        form.setFieldValue("active", resp.data.plate.active);

        setPreviewUrl(resp.data.plate.photo);
      } else {
        toast({
          variant: "destructive",
          title: "Algo salio mal al obtener el plato",
        });
      }
    };

    if (id) {
      getInfo();
    }
  }, []);

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
          onSubmit={form.onSubmit(async (values) => {
            console.log(values);

            if (previewUrl) {
              let logoURL = "";

              setLoading(true);
              if (values.photo) {
                setUploading(true);
                logoURL = await uploadImage(values.photo, "plate");
                setUploading(false);
              } else {
                logoURL = previewUrl;
              }

              if (logoURL) {
                const payload = {
                  restaurantId: snapAuth.user?.restaurant._id as string,
                  plateId: id,
                  plate: {
                    photo: logoURL,
                    name: values.name,
                    description: values.description,
                    price: Number(values.price),
                    ingredients: values.ingredients,
                    categories: values.categories,
                    isRecommendation: values.isRecommendation,
                    active: values.active
                  },
                };

                const resp = await addUpdatePlate(payload);

                if (resp.ok) {
                  toast({
                    title: id
                      ? "Se ha actualizado el plato exitosamente!"
                      : "Se ha creado el plato exitosamente!",
                  });

                  navigate("/home/owner/menu");
                } else {
                  toast({
                    variant: "destructive",
                    title: "Algo salio mal.",
                  });
                }
              } else {
                toast({
                  variant: "destructive",
                  title: "Algo salio mal al subir la imagen.",
                });
              }
              setLoading(false);
            }
          })}
          className="flex flex-col gap-4 w-96 border p-5 rounded-md"
        >
          <div>{previewUrl ? <img src={previewUrl} alt="plate" /> : null}</div>

          <Input
            label="Foto"
            required={id ? false : true}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                form.setFieldValue("photo", e.target.files[0]);
                setPreviewUrl(URL.createObjectURL(e.target.files[0]));
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
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
              />
              <IconPlus
                role="button"
                stroke={2}
                onClick={() => {
                  if (ingredient) {
                    form.setFieldValue("ingredients", [
                      ...form.values.ingredients,
                      ingredient,
                    ]);
                    setIngredient("");
                  }
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
              Recomendacion del Chef
            </Label>
          </div>

          <div className="flex gap-2 my-3">
            <Checkbox
              checked={form.values.active}
              onCheckedChange={(value) =>
                form.setFieldValue("active", Boolean(value))
              }
            />
            <Label className="font-bold font-sans text-dark-blue text-left">
              Plato Activo
            </Label>
          </div>
          <Button
            variant={"outline"}
            loading={loading || uploading}
            type="submit"
          >
            {uploading
              ? "Uploading Image..."
              : loading
              ? id
                ? "Actualizando Plato..."
                : "Agregando Plato..."
              : id
              ? "Actualizar Plato"
              : "Agregar Plato"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddViewPlate;
