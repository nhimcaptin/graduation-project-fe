import { MESSAGE_ERROR } from "../consts/messages";

export interface IMessage {
  message: string;
  stack?: string;
  status?: number;
  success?: boolean;
}

export const handleErrorMessage = (err: IMessage) => {
  return MESSAGE_ERROR[err.message] || MESSAGE_ERROR.ERROR_SYSTEM;
};
