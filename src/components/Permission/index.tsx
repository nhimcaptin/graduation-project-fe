import React from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Permission = (props: any) => {
  const { children, role } = props;
  const { permissions } = useSelector((state: any) => state.permission);
  if (
    role &&
    !permissions.some((permission: any) => {
      let hasPermission = false;
      if (typeof role === "string") hasPermission = permission?.resource?.code === role;
      else if (typeof role === "object" && role.length && role.length > 0)
        hasPermission = role.includes(permission?.resource?.code);
      return (
        hasPermission && (permission?.actions || []).some((action: any) => action.code === "ACTION_ROLE_CODE.View")
      );
    })
  ) {
    return <Navigate to={"ROUTERS_PATHS.AUTHORIZATION"} replace />;
  }

  return <Box>{children}</Box>;
};

export default Permission;