import escapeStringRegexp from "escape-string-regexp";

export const convertFilter = (data) => {
  const filterConditionsArray = data && data.split(",");
  const obj = {};
  (filterConditionsArray || []).forEach((x) => {
    if (x.indexOf("==") >= 0) {
      const [label, value] = x.split("==");
      if (["formDate"].includes(label)) {
        const startOfDay = new Date(value);
        startOfDay.setHours(0, 0, 0, 0);
        obj["date"] = { ...(obj["date"] ? obj["date"] : {}), $gte: startOfDay };
      } else if (["toDate"].includes(label)) {
        const endOfDay = new Date(value);
        endOfDay.setHours(23, 59, 59, 999);
        obj["date"] = { ...(obj["date"] ? obj["date"] : {}), $lte: endOfDay };
      } else if (["status", "service", "role"].includes(label)) {
        obj[label] = { $in: value ? value.split("|") : "" };
      } else {
        obj[label] = value;
      }
    }
    if (x.indexOf("@=") >= 0) {
      const [label, value] = x.split("@=");
      obj[label] = { $regex: escapeStringRegexp(value) };
    }
  });
  return obj;
};

const randomString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+<>?";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const randomStringInRange = (minLength, maxLength) => {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  return randomString(length);
};
