import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled, SxProps } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import classNames from "clsx";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "./styles.css";
import ButtonCustom from "../ButtonCustom";

const DialogCustom = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const useStyles = makeStyles(() => ({
  dialogTitle: {
    fontWeight: "700 !important",
    fontSize: "16px !important",
    lineHeight: "20px !important",
    color: "#451C1C",
    backgroundColor: "#FFD392",
    zIndex: 2,
  },
}));

interface DialogTitleCustomProps {
  children: React.ReactNode;
  onClose?: (parameters?: any) => void;
}

const DialogTitleCustomDefaultProps = {
  children: <></>,
  onClose: (parameters?: any) => {},
};

const DialogTitleCustom: React.FC<DialogTitleCustomProps> = (props = DialogTitleCustomDefaultProps) => {
  const { children, onClose, ...others } = props;
  const classes = useStyles();

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...others} className={classes.dialogTitle}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

interface CrudModalProps {
  isOpen: boolean;
  handleClose?: (parameters?: any) => any;
  handleSave?: (parameters?: any) => void;
  handlePreview?: (parameters?: any) => void;
  handleLogOut?: (parameters?: any) => void;
  handleSaveDraft?: (parameters?: any) => void;
  handleAddNew?: (parameters?: any) => void;
  isSaving?: boolean;
  isAddingNew?: boolean;
  cancelBtnLabel?: string;
  saveBtnLabel?: string;
  previewBtnLabel?: string;
  saveDraftBtnLabel?: string;
  formTitle: string;
  addNewLabel?: string;
  children: React.ReactNode;
  dialogProps?: Object;
  contentClassName?: string;
  styleModal?: string | undefined;
  isIconClose?: boolean | undefined;
  loading?: boolean | undefined;
  sx?: SxProps;
  isDisable?: any;
  noCheckingChanges?: boolean;
  virtualPadding?: boolean;
  isCancelGray?: boolean;
}

const CrudModalDefaultProps = {
  isOpen: false,
  handleClose: (parameters?: any) => {},
  handleSave: (parameters?: any) => {},
  handlePreview: (parameters?: any) => {},
  handleAddNew: (parameters?: any) => {},
  handleLogOut: (parameters?: any) => {},
  handleSaveDraft: (parameters?: any) => {},
  isSaving: undefined,
  isAddingNew: undefined,
  cancelBtnLabel: "",
  saveBtnLabel: "",
  previewBtnLabel: "",
  saveDraftBtnLabel: "",
  addNewLabel: "",
  formTitle: "",
  children: <></>,
  dialogProps: {},
  contentClassName: "",
  styleModal: "",
  isIconClose: false,
  loading: false,
  isConfirmModal: false,
  virtualPadding: false,
  isCancelGray: false,
};

const CrudModal = React.forwardRef<HTMLDivElement, React.PropsWithChildren<CrudModalProps>>(
  (props = CrudModalDefaultProps, ref) => {
    const {
      isOpen,
      handleClose,
      handleSave,
      handlePreview,
      handleLogOut,
      handleAddNew,
      isSaving,
      isAddingNew,
      cancelBtnLabel,
      saveBtnLabel,
      previewBtnLabel,
      addNewLabel,
      formTitle,
      children,
      dialogProps,
      contentClassName = "",
      styleModal,
      loading,
      isDisable,
      noCheckingChanges,
      virtualPadding,
      isCancelGray,
    } = props;
    const isLoading = loading || isAddingNew || isSaving;

    return (
      <DialogCustom className={styleModal} open={isOpen} {...dialogProps} ref={ref}>
        <DialogTitleCustom onClose={loading ? undefined : handleClose}>{formTitle}</DialogTitleCustom>
        <DialogContent dividers className={classNames(contentClassName)} sx={{ maxHeight: window.innerHeight - 200 }}>
          <form onSubmit={handleSave}>
            {children}
            <ButtonCustom type="submit" className="d-none" />
          </form>
          {virtualPadding && (
            <div
              style={{
                height: "100%",
                width: "16px",
                position: "absolute",
                top: "0",
                right: "0",
                backgroundColor: "#fff",
                zIndex: 1,
              }}
            ></div>
          )}
        </DialogContent>
        <DialogActions style={{ zIndex: 2 }}>
          {handlePreview && (
            <ButtonCustom
              startIcon={<></>}
              disabled={isDisable || loading}
              color="blue"
              onClick={handlePreview}
              loading={loading}
              title={previewBtnLabel}
            />
          )}
          {handleSave && (
            <ButtonCustom
              startIcon={<></>}
              disabled={isDisable || isLoading}
              color="yellow"
              onClick={handleSave}
              loading={isSaving != undefined ? isSaving : loading}
              title={saveBtnLabel}
            />
          )}
          {handleLogOut && (
            <ButtonCustom
              color={isCancelGray ? "cancelGray" : "red"}
              onClick={handleLogOut}
              loading={loading}
              title={saveBtnLabel}
              disabled={isDisable || loading}
            />
          )}
          {handleAddNew && (
            <ButtonCustom
              startIcon={<></>}
              color="white"
              onClick={handleAddNew}
              loading={isAddingNew != undefined ? isAddingNew : loading}
              disabled={isDisable || isLoading}
              title={addNewLabel}
            />
          )}
          {handleClose && (
            <ButtonCustom color="white" onClick={handleClose} disabled={loading} title={cancelBtnLabel} />
          )}
        </DialogActions>
      </DialogCustom>
    );
  }
);

export default CrudModal;
