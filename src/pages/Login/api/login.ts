import { mongo } from "@/lib/axios";
import { User } from "@/store/auth";

async function login(payload: { email: string; password: string }) {
  try {
    const { data } = await mongo.post<{
      user: User
    }>("/api/auth/login", payload);

    return { data, ok: true };
  } catch (err) {
    console.log(err);

    return { ok: false };
  }
}

export default login;
