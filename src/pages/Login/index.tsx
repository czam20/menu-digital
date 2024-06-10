import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@mantine/form";
import { Link } from "react-router-dom";
import login from "./api/login";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

type LoginForm = {
  email: string;
  password: string;
};

function Login() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    initialValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-4xl">Ingresar a la App</h1>
        <form
          onSubmit={form.onSubmit(async (values) => {
            setLoading(true);

            const resp = await login(values);

            if (resp.ok) {
              window.localStorage.setItem(
                "auth",
                JSON.stringify(resp.data?.user)
              );
              window.location.reload();
            } else {
              toast({
                variant: "destructive",
                description: "Hubo un problema al ingresar.",
              });
            }

            setLoading(false);
          })}
          className="flex flex-col gap-4 w-96 border p-5 rounded-md"
        >
          <Input
            type="email"
            label="Correo Electrónico"
            required
            value={form.values.email}
            onChange={(e) => form.setFieldValue("email", e.target.value)}
          />
          <Input
            type="password"
            label="Contraseña"
            required
            value={form.values.password}
            onChange={(e) => form.setFieldValue("password", e.target.value)}
          />
          <Button type="submit" loading={loading}>
            Ingresar
          </Button>
        </form>
        <div>
          ¿Aún no tienes una cuenta?{" "}
          <Link to="/owner/register" className="underline text-blue-300">
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
