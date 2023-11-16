import { LabelDisplayedRowsArgs } from "@mui/material";
import DISPLAY_TEXTS from "../consts/display-texts";
import { statusOptions } from "../consts/statusCode";
import { SyntheticEvent } from "react";
import moment from "moment";

export const FORMAT_DATE = "DD/MM/YYYY";
export const fromDateFormat = "YYYY-MM-DDT00:00:00";
export const toDateFormat = "YYYY-MM-DDT23:59:00";
export const rowsPerPageOptions = [10, 20, 50];

export const convertBreakToHtml = (text: string) => {
  return text && text.replace(/\r?\n/g, "<br/>");
};

export const numberWithCommas = (x: number) => {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

export const getMultiLabel = (filterList: any[], columnName: string) => {
  let result = "";
  if (typeof filterList === "string") {
    return filterList;
  }
  (filterList || []).map((item, index) => {
    if (index === 0) {
      result += item[columnName] + "";
    } else {
      result += ", " + item[columnName];
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

export const isCheckValue = (data: any, arrKeyDelete: any, isDisabled?: boolean) => {
  const _data = { ...((data && data[0]) || {}) };
  Object.keys(_data).forEach((x) => {
    if (_data[x] && Array.isArray(_data[x])) {
      const r = { ...((_data[x] && _data[x][0]) || {}) };
      Object.assign(_data, r);
      Reflect.deleteProperty(_data, x);
    }
  });
  arrKeyDelete.forEach((r: any) => {
    Reflect.deleteProperty(_data, r);
  });
  return isDisabled && !!Object.values(_data).find((x: any) => !!x);
};

export const TIME_REPORT = [
  {
    title: "Hôm qua",
    fromDate: moment().subtract(1, "days").format(fromDateFormat),
    toDate: moment().subtract(1, "days").format(toDateFormat),
  },
  {
    title: "Hôm nay",
    fromDate: moment().format(fromDateFormat),
    toDate: moment().format(toDateFormat),
  },
  {
    title: "7 ngày qua",
    fromDate: moment().subtract(6, "d").format(fromDateFormat),
    toDate: moment().format(toDateFormat),
  },
  {
    title: "Tháng này",
    fromDate: moment().startOf("month").format(fromDateFormat),
    toDate: moment().format(toDateFormat),
  },
  {
    title: "Tháng trước",
    fromDate: moment().subtract(1, "months").startOf("months").format(fromDateFormat),
    toDate: moment().subtract(1, "months").endOf("months").format(toDateFormat),
  },
];
