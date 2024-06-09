import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@mantine/form";
import { Link } from "react-router-dom";

type LoginForm = {
  email: string;
  password: string;
};

function Login() {
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
          onSubmit={form.onSubmit((values) => {
            //TODO send values
            console.log(values);
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
          <Button type="submit">Ingresar</Button>
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
