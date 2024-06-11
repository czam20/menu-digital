import { mongo } from "@/lib/axios";

async function deletePlate(payload: { restaurantId: string; plateId: string }) {
  try {
    const { data } = await mongo.delete(
      `/api/restaurant/${payload.restaurantId}/plate/${payload.plateId}`
    );

    return { data, ok: true };
  } catch (err) {
    console.log(err);

    return { ok: false };
  }
}

export default deletePlate;
