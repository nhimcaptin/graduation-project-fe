import React from "react";
import { Navigate } from "react-router-dom";
import ROUTERS_PATHS from "../../consts/router-paths";
import useAuth from "../../hook/useAuth";

interface GuestGuardProps {
  children: React.ReactNode;
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children } = props;
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTERS_PATHS.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default GuestGuard;
