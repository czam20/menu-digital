import { mongo } from "@/lib/axios";

async function confirmOrder(payload: { restaurantId: string; plates: string }) {
  try {
    const { data } = await mongo.post<{ orderId: string }>(
      `/api/restaurant/${payload.restaurantId}/order`,
      {
        platos: payload.plates,
      }
    );

    return { data, ok: true };
  } catch (err) {
    console.log(err);

    return { ok: false };
  }
}

export default confirmOrder;
