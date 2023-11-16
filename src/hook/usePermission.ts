import { useSelector } from "react-redux";
import { ACTION_ROLE_CODE } from "../consts/permission";
import { IAction, IPermission } from "../redux/store/permissions";

export const usePermissionHook = (screenName: any) => {
  const { permissions } = useSelector((state: any) => state.permission);
  const currentScreenPermission = permissions.find((permission: IPermission) =>
    screenName.includes(permission?.resource?.code)
  ) as IPermission | undefined;
  const hasView = currentScreenPermission
    ? currentScreenPermission.actions.some((action: IAction) => action.code === ACTION_ROLE_CODE.View)
    : false;
  const hasCreate = currentScreenPermission
    ? currentScreenPermission.actions.some((action: IAction) => action.code === ACTION_ROLE_CODE.Create)
    : false;
  const hasUpdate = currentScreenPermission
    ? currentScreenPermission.actions.some((action: IAction) => action.code === ACTION_ROLE_CODE.Update)
    : false;
  const hasDelete = currentScreenPermission
    ? currentScreenPermission.actions.some((action: IAction) => action.code === ACTION_ROLE_CODE.Delete)
    : false;
  const hasExport = currentScreenPermission
    ? currentScreenPermission.actions.some((action: IAction) => action.code === ACTION_ROLE_CODE.Export)
    : false;
  return {
    hasView,
    hasCreate,
    hasUpdate,
    hasDelete,
    hasExport,
  };
};
