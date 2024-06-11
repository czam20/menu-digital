import { mongo } from "@/lib/axios";

async function addUpdatePlate(payload: {
  restaurantId: string;
  plateId?: string;
  plate: {
    photo: string;
    name: string;
    description: string;
    price: number;
    ingredients: Array<string>;
    categories: Array<"entrada" | "postre" | "principal" | "bebida">;
    isRecommendation: boolean;
    active: boolean
  };
}) {
  try {
    const method = payload.plateId ? "put" : "post";

    console.log(payload.plateId, method)

    const { data } = await mongo[method](
      `/api/restaurant/${payload.restaurantId}/plate${
        payload.plateId ? `/${payload.plateId}` : ""
      }`,
      payload.plate
    );

    return { data, ok: true };
  } catch (err) {
    console.log(err);

    return { ok: false };
  }
}

export default addUpdatePlate;
