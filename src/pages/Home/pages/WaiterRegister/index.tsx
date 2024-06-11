import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@mantine/form";
import { useState } from "react";
import waiterRegister from "./api/waiter-register";
import { useSnapshot } from "valtio";
import authStore from "@/store/auth";
import { useToast } from "@/components/ui/use-toast";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router";

type WaiterInfoForm = {
  name: string;
  email: string;
  dni: string;
  password: string;
  confirmPassword: string;
};

function WaiterRegister() {
  const [loading, setLoading] = useState(false);
  const snapAuth = useSnapshot(authStore);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<WaiterInfoForm>({
    initialValues: {
      name: "",
      email: "",
      dni: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      confirmPassword: (value, values) => {
        return value !== values.password
          ? "Las contraseñas no coinciden"
          : null;
      },
    },
  });

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-4xl">Registro Mesero</h1>
        <IconArrowLeft
          onClick={() => {
            navigate("/home");
          }}
          role="button"
          stroke={2}
        />
        <form
          className="flex flex-col gap-4 w-96 border p-5 rounded-md"
          onSubmit={form.onSubmit(async (values) => {
            setLoading(true);

            const payload = {
              waiter: {
                fullname: values.name,
                email: values.email,
                dni: values.dni,
                password: values.password,
              },
              restaurantId: snapAuth.user?.restaurant._id as string,
            };

            const resp = await waiterRegister(payload);

            if (resp.ok) {
              toast({
                description: "Se ha registrado al mesero exitosamente!.",
              });

              form.reset();
            } else {
              toast({
                variant: "destructive",
                description: "Hubo un problema al registrar al mesero.",
              });
            }

            setLoading(false);
          })}
        >
          <Input
            label="Nombre Completo"
            required
            value={form.values.name}
            onChange={(e) => form.setFieldValue("name", e.target.value)}
          />
          <Input
            type="email"
            label="Correo Electrónico"
            required
            value={form.values.email}
            onChange={(e) => form.setFieldValue("email", e.target.value)}
          />
          <Input
            label="Número de Identificación"
            required
            value={form.values.dni}
            onChange={(e) => form.setFieldValue("dni", e.target.value)}
          />
          <Input
            type="password"
            label="Contraseña"
            required
            value={form.values.password}
            onChange={(e) => form.setFieldValue("password", e.target.value)}
          />
          <Input
            type="password"
            label="Confirmar Contraseña"
            required
            value={form.values.confirmPassword}
            onChange={(e) =>
              form.setFieldValue("confirmPassword", e.target.value)
            }
            error={form.errors.confirmPassword as string}
          />
          <Button type="submit" variant="outline" loading={loading}>
            Registrar
          </Button>
        </form>
      </div>
    </div>
  );
}

export default WaiterRegister;
