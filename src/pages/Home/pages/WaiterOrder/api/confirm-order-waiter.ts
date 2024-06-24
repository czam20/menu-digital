import { mongo } from "@/lib/axios";

async function confirmOrderWaiter(payload: {
  restaurantId: string;
  orderId: string;
  plates: string;
  table: number;
  client: {
    fullname: string;
    dni: string;
    address: string;
  };
}) {
  try {
    const { data } = await mongo.put<{ orderId: string }>(
      `/api/restaurant/${payload.restaurantId}/order/${payload.orderId}`,
      {
        platos: payload.plates,
        table: payload.table,
        client: payload.client,
      }
    );

    return { data, ok: true };
  } catch (err) {
    console.log(err);

    return { ok: false };
  }
}

export default confirmOrderWaiter;
