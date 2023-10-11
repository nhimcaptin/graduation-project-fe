import escapeStringRegexp from 'escape-string-regexp';

export const convertFilter = (data) => {
  const filterConditionsArray = data && data.split(",");
  const obj = {};
  (filterConditionsArray || []).forEach((x) => {
    if (x.indexOf("==") >= 0) {
      const [label, value] = x.split("==");
      obj[label] = value;
    }
    if (x.indexOf("@=") >= 0) {
      const [label, value] = x.split("@=");
      obj[label] = { $regex: escapeStringRegexp(value) };
    }
  });
  return obj;
};
