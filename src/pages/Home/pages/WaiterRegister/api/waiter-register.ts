import { mongo } from "@/lib/axios";

async function waiterRegister(payload: {
  restaurantId: string;
  waiter: {
    fullname: string;
    email: string;
    dni: string;
    password: string;
  };
}) {
  try {
    const { data } = await mongo.post(
      `/api/users/restaurant/${payload.restaurantId}/waiter`,
      payload.waiter
    );

    return { data, ok: true };
  } catch (err) {
    console.log(err);

    return { ok: false };
  }
}

export default waiterRegister;
