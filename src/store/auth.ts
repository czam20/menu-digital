import { proxy } from "valtio";

export type User = {
  dni: string;
  email: string;
  fullname: string;
  restaurant: {
    address: string;
    logo: string;
    name: string;
    // orders: [];
    // plates: [];
    rif: string;
    _id: string;
  };
  rol: "owner" | "waiter";
};

type UserStates = User | null | undefined;

const authStore = proxy<{
  user: UserStates;
}>({
  user: undefined,
});

export default authStore;
