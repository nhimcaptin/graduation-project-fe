export const RegPhoneNumber = (numberPhone: any) => {
  // const regex = new RegExp(/(84|0)+([0-9]{0,11})\b/g);
  const regex = new RegExp(/(84|0[1|2|3|5|7|8|9])+([0-9]{7,13})\b/g);
  return regex.test(numberPhone);
};
