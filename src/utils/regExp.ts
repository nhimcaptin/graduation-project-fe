import { MESSAGE_ERROR } from "../consts/messages";

export const RegPhoneNumber = (numberPhone: any) => {
  // const regex = new RegExp(/(84|0)+([0-9]{0,11})\b/g);
  const regex = new RegExp(/(84|0[1|2|3|5|7|8|9])+([0-9]{7,13})\b/g);
  return regex.test(numberPhone);
};

export const RegExpEmail = (email: any) => {
  let num = 0;
  if (email) {
    for (let i = 0; i < email.length; ++i) {
      if (email[i] === "@") {
        num += 1;
      }
    }
  }
  if (num > 1) {
    return MESSAGE_ERROR.RegExpEmail;
  } else {
    const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/g);
    return regex.test(email);
  }
};


export const RegNumber = /^[0-9\b]+$/;
export const REGEX_NON_NUMBER = /[^0-9]/g;
export const REGEX_NON_DECIMAL = /[^0-9.]/g;