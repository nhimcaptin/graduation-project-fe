import { LabelDisplayedRowsArgs } from "@mui/material";
import DISPLAY_TEXTS from "../consts/display-texts";

export const rowsPerPageOptions = [10, 20, 50];

export const labelDisplayedRows = (page: LabelDisplayedRowsArgs) =>
  `${page.from}-${page.to === -1 ? page.count : page.to} ${DISPLAY_TEXTS.displayRow} ${page.count}`;

export const convertSearchString = (value: string) => {
  const specialCharacters = [",", "<", ">", "|"];
  const addStr = "\\";
  var strArr = String(value).split("");
  const newStr = strArr
    .map((e) => {
      if (specialCharacters.includes(e)) {
        return addStr + e;
      } else return e;
    })
    .reduce((pre, currennt) => {
      return pre + currennt;
    });
  return newStr;
};
