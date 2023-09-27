import React from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";
import { LoadingButton } from "@mui/lab";
import { SxProps } from "@mui/material";

type ColorType = "green";
type SizeType = "large" | "medium" | "small";
type TypeButton = "button" | "submit" | "reset" | undefined;

interface ButtonCustomProps {
  children?: React.ReactNode;
  id?: string;
  className?: string;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  color?: ColorType;
  size?: SizeType;
  sx?: SxProps;
  type?: TypeButton;
}

const ButtonCustom = (props: ButtonCustomProps) => {
  const { children, color, className, disabled, title, ...restProps } = props;
  const btnColor = styles[color || ""] || "";

  return (
    <LoadingButton
      {...restProps}
      color="primary"
      classes={{ loadingIndicator: styles.loadingIcon }}
      loadingPosition={restProps.startIcon ? "start" : "center"}
      className={clsx(styles.btn, btnColor, className, {
        [styles.disabled]: disabled,
      })}
      disabled={disabled}
    >
      {children || title}
    </LoadingButton>
  );
};

export default ButtonCustom;
