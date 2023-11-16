const URL_PATHS = {
  LOGIN: "api/auth/login-admin",
  LOG_OUT: "api/auth/logout",
  REGISTER: "api/auth/register",
  GET_CURRENT_USER: "api/users/get-current-user",
  CREATE_USER: "api/users",
  GET_USER: "api/users/get-list",
  DETAIL_USER: "api/users/detail",
  RESOURCE_ACTION: "api/role/resource-actions",
  PERMISSIONS: "api/role/permissions",
  ROLE_GET_DETAIL: "api/role/get-detail",
  ROLE_GET: "api/role",
  ROLE_EDIT: "api/role/edit-role",
  GET_BOOKING: "api/booking/get-list",
  GET_DOCTOR: "api/users/get-list-doctor",
  GET_LIST_MAIN_SERVICE: "api/main-service/getAll",
  GET_DETAIL_MAIN_SERVICE: "api/main-service/get",
  DELETE_MAIN_SERVICE: "api/main-service/delete",
  UPDATE_MAIN_SERVICE: "api/main-service/update",
  CREATE_MAIN_SERVICE: "api/main-service/create",
  GET_LIST_SUB_SERVICE: "api/sub-service/getAll",
  GET_DETAIL_SUB_SERVICE: "api/sub-service/detailSubservice",
  DELETE_SUB_SERVICE: "api/sub-service/delete",
  UPDATE_SUB_SERVICE: "api/sub-service/update",
  CREATE_SUB_SERVICE: "api/sub-service/create",
  GET_LIST_TIME_TYPE: "api/time-type/get-list",
  CREATE_BOOKING: "api/booking/create",
  DETAIL_BOOKING: "api/booking/detail-booking",
  CONFIRM_BOOKING: "api/booking/update-status",
  GET_DETAIL_COME_CHECK: "api/booking/get-detail-come-check",
  GET_HISTORY: "api/history/get-list",
  CREATE_HISTORY: "api/history/create",
  DETAIL_HISTORY: "api/history/get-detail",
  UPDATE_HISTORY: "api/history/update",
  UPLOAD_FILE: "api/upload-image",

  GET_LIST_VOUCHER: "api/preferential/get",
  CREATE_VOUCHER: "api/preferential/create",
  DETAIL_VOUCHER: "api/preferential/detail",
  UPDATE_VOUCHER: "api/preferential/update",
  DELETE_VOUCHER: "api/preferential/delete",

  DASHBOARD: "api/dashboard",
  DASHBOARD_COUNT: "api/dashboard/count",
  DASHBOARD_INFORMATION: "api/dashboard/data-information",
};
export default URL_PATHS;
