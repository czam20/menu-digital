import authStore from "@/store/auth";
import { ReactNode } from "react";
import { Navigate } from "react-router";
import { useSnapshot } from "valtio";

function UnauthenticatedRoutes(props: { children: ReactNode }) {
  const snapAuth = useSnapshot(authStore);

  console.log(snapAuth.user)

  if (!snapAuth.user) {
    return props.children;
  }

  return <Navigate to={"/home"} />;
}

export default UnauthenticatedRoutes;
