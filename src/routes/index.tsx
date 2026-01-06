import { BrowserRouter } from "react-router";

import { AuthRoutes } from "./AuthRoutes";
import { ManagerRoutes } from "./ManagerRoutes";
import { EmployeeRoutes } from "./EmployeeRoutes";
import { Loading } from "../components/Loading";

const isLoading = false;

const session = {
  user: {
    role: "",
  },
};

export function Routes() {
  function Route() {
    switch (session.user.role) {
      case "manager":
        return <ManagerRoutes />;
      case "employee":
        return <EmployeeRoutes />;
      default:
        return <AuthRoutes />;
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Route />
    </BrowserRouter>
  );
}
