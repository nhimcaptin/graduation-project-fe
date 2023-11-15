import apiService from "../../../services/api-services";
import URL_PATHS from "../../../services/url-path";

export interface IAction {
  code: string;
  name: string;
}

export interface IResource {
  code: string;
  name: string;
}

export interface IPermission {
  actions: IAction[];
  resource: IResource;
}

export interface IGetPermissionResponse {
  permissions: IPermission[];
}

export const GetPermission = async () => {
  try {
    const res = (await apiService.get(`${URL_PATHS.RESOURCE_ACTION}`)) as IPermission[];
    const item = { permissions: res } as IGetPermissionResponse;
    return item;
  } catch (error: any) {
    throw error;
  }
};
