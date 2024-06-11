import { mongo } from "@/lib/axios";

export type Plate = {
  active: boolean;
  categories: Array<"entrada" | "postre" | "principal" | "bebida">;
  description: string;
  ingredients: Array<string>;
  isRecommendation: boolean;
  name: string;
  photo: string;
  price: number;
  _id: string;
};

async function getAllPlates(payload: { restaurantId: string }) {
  try {
    const { data } = await mongo.get<{
      plates: Plate[];
    }>(`/api/restaurant/${payload.restaurantId}/plate`);

    return { data, ok: true };
  } catch (err) {
    console.log(err);

    return { ok: false };
  }
}

export default getAllPlates;
