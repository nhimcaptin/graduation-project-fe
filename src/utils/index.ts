import { LabelDisplayedRowsArgs } from "@mui/material";
import DISPLAY_TEXTS from "../consts/display-texts";
import { statusOptions } from "../consts/statusCode";
import { SyntheticEvent } from "react";

export const FORMAT_DATE = "DD/MM/YYYY";
export const rowsPerPageOptions = [10, 20, 50];

export const convertBreakToHtml = (text: string) => {
  return text && text.replace(/\r?\n/g, "<br/>");
};

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

export const getMultiFilter = (filterList: any[], columnName: string) => {
  let result = "";
  if (typeof filterList === "string") {
    return filterList;
  }
  (filterList || []).map((item, index) => {
    if (index === 0) {
      result += item[columnName] + "";
    } else {
      result += "|" + item[columnName];
    }
  });
  return result;
};

export const stripHTML = (html: string) => {
  let doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export const getRowStatus = (value: any) => {
  let result = statusOptions.find((s) => s.value === value) || {
    label: "",
    chipType: "",
    value: "",
  };
  return result;
};

export const handleErrorImage = (e: SyntheticEvent<HTMLImageElement, Event>, fallbackImage: string) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = fallbackImage;
};

export const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
