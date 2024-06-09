import SelectGeneral from "@/components/custom/select-general";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { Link } from "react-router-dom";

type RifPrefix = "V" | "J";

type OwnerInfoForm = {
  ownerName: string;
  ownerEmail: string;
  ownerDNI: string;
  password: string;
  confirmPassword: string;
};

type RestaurantInfoForm = {
  restaurantName: string;
  restaurantLocation: string;
  restaurantRifPrefix: RifPrefix;
  restaurantRifNumber: string;
};

const STEPS = {
  RESTAURANT_INFO: 0,
  OWNER_INFO: 1,
} as const;

function OwnerRegister() {
  const [step, setStep] = useState<number>(STEPS.RESTAURANT_INFO);

  const form = useForm<RestaurantInfoForm & OwnerInfoForm>({
    initialValues: {
      restaurantName: "",
      restaurantLocation: "",
      restaurantRifPrefix: "V",
      restaurantRifNumber: "",

      ownerName: "",
      ownerEmail: "",
      ownerDNI: "",
      password: "",
      confirmPassword: "",
    },
  });

  const renderStep = () => {
    switch (step) {
      case STEPS.RESTAURANT_INFO:
        return (
          <>
            <Input
              label="Nombre"
              required
              value={form.values.restaurantName}
              onChange={(e) =>
                form.setFieldValue("restaurantName", e.target.value)
              }
            />
            <Input
              label="Ubicación"
              required
              value={form.values.restaurantLocation}
              onChange={(e) =>
                form.setFieldValue("restaurantLocation", e.target.value)
              }
            />

            <div className="flex flex-col">
              <div className="flex gap-1">
                <Label className="font-bold font-sans text-dark-blue">
                  Número de Rif
                </Label>

                <span className="text-red-700 font-sans">*</span>
              </div>
              <div className="flex gap-1">
                <SelectGeneral
                  triggerClassName="w-[80px]"
                  required
                  items={["V", "J"]}
                  value={form.values.restaurantRifPrefix}
                  onChange={(value) =>
                    form.setFieldValue(
                      "restaurantRifPrefix",
                      value as RifPrefix
                    )
                  }
                />
                <Input
                  required
                  containerClassName="w-full"
                  value={form.values.restaurantRifNumber}
                  onChange={(e) =>
                    form.setFieldValue("restaurantRifNumber", e.target.value)
                  }
                />
              </div>
            </div>

            <Button type="submit">Continuar</Button>
          </>
        );

      case STEPS.OWNER_INFO:
        return (
          <>
            <Input
              label="Nombre Completo"
              required
              value={form.values.ownerName}
              onChange={(e) => form.setFieldValue("ownerName", e.target.value)}
            />
            <Input
              type="email"
              label="Correo Electrónico"
              required
              value={form.values.ownerEmail}
              onChange={(e) => form.setFieldValue("ownerEmail", e.target.value)}
            />
            <Input
              label="Número de Identificación"
              required
              value={form.values.ownerDNI}
              onChange={(e) => form.setFieldValue("ownerDNI", e.target.value)}
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
            />
            <Button type="submit">Registrar</Button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-4xl">Registro</h1>
          <h2 className="text-center text-3xl mb-5">
            Datos del{" "}
            {step === STEPS.OWNER_INFO ? "Propietario" : "Restaurante"}
          </h2>
          <form
            onSubmit={form.onSubmit((values) => {
              if (step === STEPS.RESTAURANT_INFO) {
                setStep(STEPS.OWNER_INFO);
              } else {
                //TODO send values
                console.log(values);
              }
            })}
            className="flex flex-col gap-4 w-96 border p-5 rounded-md"
          >
            {renderStep()}
          </form>
          <div>¿Ya tienes una cuenta? <Link to='/login' className="underline text-blue-300">Ingresar</Link></div>
        </div>
      </div>
    </>
  );
}

export default OwnerRegister;
