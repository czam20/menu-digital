import { mongo } from "@/lib/axios";

async function getOrder(payload: { restaurantId: string; orderId: string }) {
  try {
    const { data } = await mongo.get<{ order: { platos: string } }>(
      `/api/restaurant/${payload.restaurantId}/order/${payload.orderId}`
    );

    return { data, ok: true };
  } catch (err) {
    console.log(err);

    return { ok: false };
  }
}

export default getOrder;
