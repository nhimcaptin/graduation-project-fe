import { MESSAGE_ERROR_API } from "../consts/messages";

export interface IMessage {
  message: string;
  stack?: string;
  status?: number;
  success?: boolean;
}

export const handleErrorMessage = (err: IMessage) => {
  return MESSAGE_ERROR_API[err.message] || MESSAGE_ERROR_API.ERROR_SYSTEM;
};
