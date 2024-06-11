import { mongo } from "@/lib/axios";
import { Plate } from "../../ViewEditMenu/api/get-all-plates";

async function getPlate(payload: { restaurantId: string; plateId: string }) {
  try {
    const { data } = await mongo.get<{ plate: Plate }>(
      `/api/restaurant/${payload.restaurantId}/plate/${payload.plateId}`
    );

    return { data, ok: true };
  } catch (err) {
    console.log(err);

    return { ok: false };
  }
}

export default getPlate;
