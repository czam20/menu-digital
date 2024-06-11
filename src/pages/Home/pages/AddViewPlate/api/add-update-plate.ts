import { mongo } from "@/lib/axios";

async function addUpdatePlate(payload: {
  restaurantId: string;
  plate: {
    photo: string;
    name: string;
    description: string;
    price: number;
    ingredients: Array<string>;
    categories: Array<"entrada" | "postre" | "principal" | "bebida">;
    isRecommendation: boolean;
  };
}) {
  try {
    const { data } = await mongo.post(
      `/api/restaurant/${payload.restaurantId}/plate`,
      payload.plate
    );

    return { data, ok: true };
  } catch (err) {
    console.log(err);

    return { ok: false };
  }
}

export default addUpdatePlate;
