import { mongo } from "@/lib/axios";

async function getOrders(payload: { restaurantId: string }) {
  try {
    const { data } = await mongo.get<{
      orders: Array<{
        confirmed: boolean;
        table: number;
        client: { fullname: string };
      }>;
    }>(`/api/restaurant/${payload.restaurantId}/order`);

    return { data, ok: true };
  } catch (err) {
    console.log(err);

    return { ok: false };
  }
}

export default getOrders;
