import React from "react";

import { SxProps } from "@mui/material";
import TextFieldMaterial from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import COLORS from "../../consts/colors";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const useStyles = makeStyles(() => ({
  textField: {
    "& label.MuiInputLabel-root": {
      fontSize: "14px",
      color: COLORS.TEXT_DISABLED,
    },
    "& textarea": {
      fontSize: "14px",
      color: COLORS.TEXT_DISABLED,
    },
    "& input": {
      fontSize: "14px",
      color: COLORS.TEXT_DISABLED,
    },
    "& div.Mui-disabled": {
      backgroundColor: "#E7E7E7",

      "& textarea": {
        "-webkit-text-fill-color": COLORS.TEXT_DISABLED,
        color: COLORS.TEXT_DISABLED,
      },
      "& input": {
        "-webkit-text-fill-color": COLORS.TEXT_DISABLED,
        color: COLORS.TEXT_DISABLED,
      },
      "& .MuiAutocomplete-endAdornment": {
        display: "none",
      },
    },
  },
  borderInput: {
    "& .MuiOutlinedInput-root": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#D2D1D1 !important",
      },
    },
  },
}));

type VariantType = "outlined" | "filled" | "standard";
type TypeType = "password" | "number" | "text" | "tel" | "email";

export interface TextFieldCustomProps {
  className?: string;
  defaultValue?: string;
  id?: string;
  value?: any;
  multiline?: boolean;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  label?: any;
  onChange?: (
    parameters: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onBlur?: (
    parameters: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement,
      Element
    >
  ) => void;
  onKeyDown?: (parameters: React.KeyboardEvent<HTMLDivElement>) => void;
  onInput?: (parameters: React.FormEvent<HTMLDivElement>) => void;
  onClick?: (parameters: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onPaste?: (parameters: React.ClipboardEvent<HTMLDivElement>) => void;
  error?: boolean;
  errorMessage?: any;
  inputProps?: any;
  InputProps?: {
    endAdornment?: any;
    startAdornment?: any;
  };
  type?: TypeType;
  variant?: VariantType;
  fullWidth?: boolean;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  formProps?: any;
  title?: string;
  sx?: SxProps;
  autoFocus?: boolean;
  autoComplete?: string;
  endAdornment?: any;
}

const TextFieldCustom = React.forwardRef(
  (props: TextFieldCustomProps, ref?: React.Ref<any>) => {
    const classes = useStyles();
    const { onClick, errorMessage, error, ...restProps } = props;

    if (ref)
      return (
        <>
          <TextFieldMaterial
            {...restProps}
            className={clsx(
              classes.textField,
              { [classes.borderInput]: !(!!errorMessage || error) },
              { [props.className || ""]: !!props.className }
            )}
            inputRef={ref}
            size="small"
            fullWidth
            autoComplete="off"
            error={!!errorMessage || error}
            onClick={(e) => {
              onClick && onClick(e);
            }}
          />
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </>
      );
    return (
      <>
        <TextFieldMaterial
          {...restProps}
          autoComplete="off"
          className={clsx(
            classes.textField,
            { [classes.borderInput]: !(!!errorMessage || error) },
            {
              [props.className || ""]: !!props.className,
            }
          )}
          size="small"
          fullWidth
          error={!!errorMessage || error}
          onClick={(e) => {
            onClick && onClick(e);
          }}
        />
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </>
    );
  }
);

export default TextFieldCustom;
