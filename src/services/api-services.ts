// import axios from 'axios';
import axios from 'axios';
import { BASE_URL } from './base-url';
import URL_PATHS from './url-path';
import { convertSearchString } from '../utils';

const isHandlerEnabled = true;

const requestHandler = (request: any, isHandlerEnabled: any) => {
    if (isHandlerEnabled) {
        request.headers['Content-Type'] = 'application/json; charset=utf-8';
        request.headers['Accept'] = 'application/json, text/javascript, */*; q=0.01';
        request.headers['Access-Control-Allow-Origin'] = '*';
    }

    const token = localStorage.getItem('token');
    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`;
    }

    return request;
};

const successHandler = (response: any, isHandlerEnabled: boolean) => {
    if (isHandlerEnabled) {
        //TODO: Do Success Handler
    }

    return response;
};

const errorHandler = (error: any, isHandlerEnabled: any) => {
    if (isHandlerEnabled) {
        //TODO: Do Error Handler
    }

    return Promise.reject({
        ...(error.response
            ? error.response.data
            : error?.message === 'ExpiredTime'
            ? {
                  errorType: 'ExpiredTime',
                  errorMessage: 'Expired Time'
              }
            : {
                  errorType: 'UnhandledException',
                  errorMessage: 'Unhandled Exception'
              })
    });
};

class Service {
    axios: any;
    handleError: (error: any, isHandlerEnabled: any) => Promise<any>;
    permissionState: any;
    constructor(namespace?: any, timeout?: number) {
        // eslint-disable-next-line no-self-assign
        namespace = namespace;
        this.axios = axios.create({
            baseURL: BASE_URL,
            responseType: 'json',
            timeout: timeout || 300000,
            timeoutErrorMessage: 'ExpiredTime',
        });

        this.handleError = async (error: any, isHandlerEnabled: any) => {
            if (isHandlerEnabled) {
                //TODO: Do Success Handler
            }

            // if (error.response.status === 401) {
            //     if (error.config.url !== refreshTokenUrl && error.config.url !== URL_PATHS.LOGIN_ADMIN) {
            //         const originalRequest = error.config;
            //         originalRequest._retry = true;
            //         try {
            //             const response = await this.refreshTokenRequest();
            //             const content = response?.data;
            //             if (content) {
            //                 localStorage.setItem('token', content.accessToken);
            //                 localStorage.setItem('refreshToken', content.refreshToken);
            //                 originalRequest.headers['Authorization'] = `Bearer ${content.accessToken}`;
            //                 return this.axios(originalRequest);
            //             } else {
            //                 alert(MESSAGES_CONFIRM.SignInExpired);
            //                 localStorage.clear();
            //                 window.location.reload();
            //                 // return errorHandler(null, isHandlerEnabled);
            //             }
            //         } catch (error) {
            //             alert(MESSAGES_CONFIRM.SignInExpired);
            //             localStorage.clear();
            //             window.location.reload();
            //             // return errorHandler(error, isHandlerEnabled);
            //         }
            //     } else {
            //         return errorHandler(error, isHandlerEnabled);
            //     }
            // } else if (error.response.status === 403) {
            //     const permissionResponse = await GetPermission();
            //     setPermissionsAction(permissionResponse?.permissions || []);
            // } else {
            //     return errorHandler(error, isHandlerEnabled);
            // }
        };

        //Enable request interceptor
        this.axios.interceptors.request.use(
            (request: any) => requestHandler(request, isHandlerEnabled),
            (error: any) => this.handleError(error, isHandlerEnabled)
        );

        //Response and Error handler
        this.axios.interceptors.response.use(
            (response: any) => successHandler(response, isHandlerEnabled),
            (error: any) => this.handleError(error, isHandlerEnabled)
        );
    }

    /**
     * Get Http Request
     * @param {any} action
     */
    get(action: any, params?: any) {
        return new Promise((resolve, reject) => {
            this.axios
                .request(params ? action + '?' + params : action, {
                    method: 'GET'
                })
                .then((response: any) => {
                    if (response.status >= 200 && response.status <= 300) {
                        resolve(response.data);
                    } else {
                        if (response.response && response.response.data && response.response.data.errors) {
                            console.error('REST request error!', response.response.data.errors);
                            reject(response.response.data.errors);
                        } else reject(response);
                    }
                })
                .catch((error: any) => {
                    if (error.response && error.response.data && error.response.data.errors) {
                        console.error('REST request error!', error.response.data.errors);
                        reject(error.response.data.errors);
                    } else reject(error);
                });
        });
    }
    // getFilter;
    /**
     * Get Http Request
     * @param {any} action
     */

    getFilter(action?: any, params?: any, filter?: any, option = {}) {
        return new Promise((resolve, reject) => {
            let apiUrl = action;
            if (params || filter) apiUrl += '?';
            if (params) {
                const paramsData = new URLSearchParams();
                for (let propertyName in params) {
                    if (params[propertyName] != undefined && params[propertyName] != '')
                        paramsData.set(propertyName, params[propertyName] || '');
                }
                apiUrl += paramsData.toString();
            }

            if (filter) {
                let param: any = `filters=`;
                for (let propertyName in filter) {
                    if (
                        filter[propertyName] !== undefined &&
                        filter[propertyName] !== null &&
                        filter[propertyName] !== ''
                    ) {
                        if (propertyName === 'fullName') {
                            param += `lastName@=${encodeURIComponent(
                                convertSearchString(filter[propertyName])
                            )}|firstname@=${encodeURIComponent(convertSearchString(filter[propertyName]))},`;
                        } else if (propertyName === 'originFullName') {
                            param += `fullName@=${encodeURIComponent(convertSearchString(filter[propertyName]))},`;
                        } else if (propertyName === 'categoryId') {
                            param += `categoryId==${encodeURIComponent(convertSearchString(filter[propertyName]))},`;
                        } else if (propertyName === 'id') {
                            param += `id==${encodeURIComponent(convertSearchString(filter[propertyName]))},`;
                        } else if (propertyName === 'dateRanges') {
                            for (let dateRange in filter[propertyName]) {
                                param += `${
                                    !!filter[propertyName][dateRange].start
                                        ? `${dateRange}>=${filter[propertyName][dateRange].start},`
                                        : ''
                                }${
                                    !!filter[propertyName][dateRange].end
                                        ? `${dateRange}<=${filter[propertyName][dateRange].end},`
                                        : ''
                                }`;
                            }
                        } else if (propertyName === 'equals') {
                            for (let equal in filter[propertyName]) {
                                if (filter[propertyName][equal]) {
                                    param += `${equal}==${encodeURIComponent(filter[propertyName][equal])},`;
                                }
                            }
                        } else if (propertyName === 'notEquals') {
                            for (let equal in filter[propertyName]) {
                                if (filter[propertyName][equal]) {
                                    param += `${equal}!=${encodeURIComponent(
                                        convertSearchString(filter[propertyName][equal])
                                    )},`;
                                }
                            }
                        } else if (typeof filter[propertyName] == 'boolean') {
                            param += `${propertyName}==${filter[propertyName] ? 'true' : 'false'},`;
                        } else if (propertyName === 'greatThan') {
                            for (let equal in filter[propertyName]) {
                                if (filter[propertyName][equal]) {
                                    param += `${equal}>=${encodeURIComponent(filter[propertyName][equal])},`;
                                }
                            }
                        } else if (propertyName === 'lessThan') {
                            for (let equal in filter[propertyName]) {
                                if (filter[propertyName][equal]) {
                                    param += `${equal}<=${encodeURIComponent(filter[propertyName][equal])},`;
                                }
                            }
                        } else if (propertyName === 'unEncoded') {
                            for (let property in filter[propertyName]) {
                                if (filter[propertyName][property]) {
                                    param += `${property}@=${encodeURIComponent(filter[propertyName][property])},`;
                                }
                            }
                        } else {
                            param += `${propertyName}@=${encodeURIComponent(
                                convertSearchString(filter[propertyName])
                            )},`;
                        }
                    }
                }
                apiUrl += '&' + param;
            }
            this.axios
                .request(apiUrl, {
                    method: 'GET',
                    ...option
                })
                .then((response: any) => {
                    if (response.status >= 200 && response.status <= 300) {
                        resolve(response.data);
                    } else {
                        if (response.response && response.response.data && response.response.data.errors) {
                            console.error('REST request error!', response.response.data.errors);
                            reject(response.response.data.errors);
                        } else reject(response);
                    }
                })
                .catch((error: any) => {
                    if (error.response && error.response.data && error.response.data.errors) {
                        console.error('REST request error!', error.response.data.errors);
                        reject(error.response.data.errors);
                    } else reject(error);
                });
        });
    }

    downloadFile(action: any, params?: any, headers?: any, options?: any) {
        return new Promise((resolve, reject) => {
            let _headers: any = headers || {};
            const token = localStorage.getItem('token');
            if (token) {
                _headers.Authorization = `Bearer ${token}`;
            }
            const requestOptions = {
                ...(options || {}),
                headers: _headers
            };
            fetch(params ? action + '?' + params : action, requestOptions)
                .then((res: any) => {
                    if (res?.ok) return res.blob();
                    else reject(res);
                })
                .then((blob: any) => resolve(blob))
                .catch((err: any) => reject(err));
        });
    }

    postParams(action: any, params: any, body?: any) {
        return new Promise((resolve, reject) => {
            this.axios
                .request(params ? action + '?' + params : action, {
                    method: 'POST',
                    data: body
                })
                .then((response: any) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.data);
                    } else {
                        if (response.response && response.response.data && response.response.data.errors) {
                            console.error('REST request error!', response.response.data.errors);
                            reject(response.response.data.errors);
                        } else reject(response);
                    }
                })
                .catch((error: any) => {
                    if (error.response && error.response.data && error.response.data.errors) {
                        console.error('REST request error!', error.response.data.errors);
                        reject(error.response.data.errors);
                    } else reject(error);
                });
        });
    }

    /**
     * Post Http Request
     * @param {any} action
     * @param {any} params
     */
    post(action: any, params?: any) {
        return new Promise((resolve, reject) => {
            this.axios
                .request(action, {
                    method: 'POST',
                    data: params
                })
                .then((response: any) => {
                    if (response?.status >= 200 && response?.status < 300) {
                        resolve(response.data);
                    } else {
                        if (response.response && response.response.data && response.response.data.errors) {
                            console.error('REST request error!', response.response.data.errors);
                            reject(response.response.data.errors);
                        } else reject(response);
                    }
                })
                .catch((error: any) => {
                    if (error.response && error.response.data && error.response.data.errors) {
                        console.error('REST request error!', error.response.data.errors);
                        reject(error.response.data.errors);
                    } else reject(error);
                });
        });
    }

    /**
     * Put Http Request
     * @param {any} action
     * @param {any} params
     */
    put(action: any, requestBody?: any, params: any = null) {
        return new Promise((resolve, reject) => {
            this.axios
                .request(params ? action + '?' + params : action, {
                    method: 'PUT',
                    data: requestBody
                })
                .then((response: any) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.data);
                    } else {
                        if (response.response && response.response.data && response.response.data.errors) {
                            console.error('REST request error!', response.response.data.errors);
                            reject(response.response.data.errors);
                        } else reject(response);
                    }
                })
                .catch((error: any) => {
                    if (error.response && error.response.data && error.response.data.errors) {
                        console.error('REST request error!', error.response.data.errors);
                        reject(error.response.data.errors);
                    } else reject(error);
                });
        });
    }
    /**
     *Delete Http Request
     * @param {any} action
     * @param {any} params
     */
    delete(action: any, params: any = null, requestBody?: any) {
        return new Promise((resolve, reject) => {
            this.axios
                .request(params ? action + '?' + params : action, {
                    method: 'DELETE',
                    data: requestBody
                })
                .then((response: any) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.data);
                    } else {
                        if (response.response && response.response.data && response.response.data.errors) {
                            console.error('REST request error!', response.response.data.errors);
                            reject(response.response.data.errors);
                        } else reject(response);
                    }
                })
                .catch((error: any) => {
                    if (error.response && error.response.data && error.response.data.errors) {
                        console.error('REST request error!', error.response.data.errors);
                        reject(error.response.data.errors);
                    } else reject(error);
                });
        });
    }
}

const apiService = new Service();
export default apiService;
