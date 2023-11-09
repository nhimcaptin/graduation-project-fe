import axios from "axios";
import { BASE_URL } from "./base-url";
import URL_PATHS from "./url-path";

export const useUploadFileService = () => {
  const uploadFileResources = async (data: any, onSuccess?: any, onError?: any) => {
    try {
      const res = await axios.post(BASE_URL + URL_PATHS.UPLOAD_FILE, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onSuccess && onSuccess(res);
      return res;
    } catch (error) {
      onError && onError(error);
      throw error;
    }
  };

  return { uploadFileResources };
};
