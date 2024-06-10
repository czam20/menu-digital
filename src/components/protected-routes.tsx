import authStore from "@/store/auth";
import { ReactNode } from "react";
import { Navigate } from "react-router";
import { useSnapshot } from "valtio";

function ProtectedRoutes(props: { children: ReactNode }) {
  const snapAuth = useSnapshot(authStore);

  if (snapAuth.user) {
    return props.children;
  }

  return <Navigate to={"/login"} />;
}

export default ProtectedRoutes;
