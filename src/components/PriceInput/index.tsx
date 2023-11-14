import React, { useCallback } from "react";

import InputAdornment from "@mui/material/InputAdornment";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import TextFieldCustom, { TextFieldCustomProps } from "../TextFieldCustom";
import { REGEX_NON_DECIMAL, REGEX_NON_NUMBER } from "../../utils/regExp";

interface PriceInputProps extends TextFieldCustomProps {
  handleChange?: (param?: any) => void;
  handleOnBlur?: (param?: any) => void;
  handleOnKeyDown?: (param?: any) => void;
  maxValue?: number;
  ref?: React.Ref<any>;
  isOnlyNumber?: boolean;
  isMonth?: boolean;
  isVND?: boolean;
  isPercent?: boolean;
  isBank?: boolean;
  isDecimal?: boolean;
}

const PriceInput = React.forwardRef((props: PriceInputProps, ref: React.Ref<any>) => {
  const {
    maxValue,
    handleChange,
    value,
    isOnlyNumber,
    isMonth,
    handleOnBlur,
    handleOnKeyDown,
    isPercent,
    isBank,
    isDecimal,
    isVND,
    ...restProps
  } = props;

  const valueDisplay = useCallback((currentValue: string | number) => {
    if (isNumber(currentValue)) return currentValue.toLocaleString("en");
    if (isString(currentValue) && currentValue.trim()) return String((+currentValue).toLocaleString("en"));
    return "";
  }, []);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const inputElement = event.target;
      let currentValue = isDecimal
        ? inputElement.value.replace(REGEX_NON_DECIMAL, "")
        : inputElement.value.replace(REGEX_NON_NUMBER, "");
      if (inputElement.value && !currentValue) {
        return;
      }
      if (handleChange) {
        if (!maxValue || maxValue >= +(currentValue || 0)) handleChange(currentValue || "");
      } else {
        inputElement.value = currentValue || "";
      }
    },
    [handleChange, maxValue]
  );

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const value = e?.clipboardData?.getData("text");
    e.preventDefault();
    const maxLengthNumber = Math.floor(((restProps.inputProps.maxLength || 0) * 3) / 4) + 1;
    const valueMaxLength = restProps.inputProps?.maxLength ? value?.toString().slice(0, maxLengthNumber) : value;
    const pastedValue = valueDisplay(valueMaxLength);
    const clipboardData = e.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData("text/plain");
    document.execCommand("insertText", false, pastedValue);
  };

  return (
    <TextFieldCustom
      {...restProps}
      ref={ref}
      onChange={onChange}
      onPaste={onPaste}
      onBlur={handleOnBlur}
      onKeyDown={handleOnKeyDown}
      value={isBank ? value : valueDisplay(value)}
      InputProps={{
        endAdornment: isOnlyNumber ? (
          <></>
        ) : isVND ? (
          <InputAdornment position="end" sx={{ "& p": { fontSize: "14px" } }}>
            VND
          </InputAdornment>
        ) : (
          <InputAdornment position="end" sx={{ "& p": { fontSize: "14px" } }}>
            Tháng
          </InputAdornment>
        ),
        ...(restProps.InputProps || {}),
      }}
    />
  );
});

export default PriceInput;
