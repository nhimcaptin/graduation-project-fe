import React, { useState } from "react";

// ---MUI
import { Box, Checkbox, FormControlLabel, Grid, InputAdornment } from "@mui/material";

// --- React hook form
import { Controller, useForm } from "react-hook-form";

import "../my-profile.scss";
import { useSetToastInformationState } from "../../../redux/store/ToastMessage";
import useAuth from "../../../hook/useAuth";
import CrudModal from "../../../components/CrudModal";
import LabelCustom from "../../../components/LabelCustom";
import TextFieldCustom from "../../../components/TextFieldCustom";
import Icons from "../../../consts/Icons";
import { MESSAGE_ERROR } from "../../../consts/messages";
import { RegPassword } from "../../../utils/regExp";

interface MyProfileProps {
  isOpen: boolean;
  handleClose: (parameters?: any) => void;
  cancelBtnLabel: string;
  saveBtnLabel: string;
  formTitle: string;
  setIsOpenChangePassWordModal: (parameters?: any) => void;
}

const CrudModalMyProfile: React.FC<MyProfileProps> = (props) => {
  const { isOpen, handleClose, cancelBtnLabel, saveBtnLabel, formTitle, setIsOpenChangePassWordModal } = props;
  const { setToastInformation } = useSetToastInformationState();
  const [isLogOutDevice, setIsLogOutDevice] = useState(false);
  const [messageErrors, setMessageErrors] = useState("");
  const [hiddenCurrentPassword, setHiddenCurrentPassword] = useState(false);
  const [hiddenNewPassword, setHiddenNewPassword] = useState(false);
  const [hiddenConfirmNewPassword, setHiddenConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const {
    formState: { errors },
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const handleSaveChangePassWordModal = async (data: any) => {
    // setDataChangePassWord(data);
    // setLoading(true);
    // try {
    //   const param = {
    //     ...data,
    //     IsLogoutOtherDevices: isLogOutDevice,
    //   };
    //   const res: any = await ChangePassWord(param);
    //   setToastInformation({ status: STATUS_TOAST.SUCCESS, message: MESSAGES_SUCCESS.ChangePassword });
    //   setIsOpenChangePassWordModal(false);
    //   LogOutAccount(logout);
    // } catch (error: any) {
    //   if (error?.status === 400) {
    //     setMessageErrors(getErrorMessage(MessageErrorsAPI[error.errors.CurrentPassword[0]]));
    //   } else {
    //     setToastInformation({ status: STATUS_TOAST.ERROR, message: MESSAGE_ERROR.ChangePasswordFailed });
    //   }
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
      <CrudModal
        isOpen={isOpen}
        handleClose={handleClose}
        handleSave={handleSubmit(handleSaveChangePassWordModal)}
        cancelBtnLabel={cancelBtnLabel}
        saveBtnLabel={saveBtnLabel}
        formTitle={formTitle}
        dialogProps={{
          fullWidth: true,
          maxWidth: "xs",
        }}
        loading={loading}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <LabelCustom title="Mật khẩu hiện tại" />
            <Controller
              key="currentPassword"
              render={({ field }: any) => (
                <TextFieldCustom
                  errorMessage={errors?.currentPassword?.message || messageErrors}
                  type={hiddenCurrentPassword ? "text" : "password"}
                  fullWidth
                  {...field}
                  onChange={async (e: any) => {
                    setValue("currentPassword", e.target.value);
                    setMessageErrors("");
                    await trigger("currentPassword");
                  }}
                  inputProps={{ maxLength: 15 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment sx={{ cursor: "pointer" }} position="start">
                        <Box
                          onClick={() =>
                            hiddenCurrentPassword
                              ? setHiddenCurrentPassword(!hiddenCurrentPassword)
                              : setHiddenCurrentPassword(!hiddenCurrentPassword)
                          }
                        >
                          {hiddenCurrentPassword ? <Icons.eyes /> : <Icons.eyesHidden />}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              name="currentPassword"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              control={control}
              defaultValue=""
            />
          </Grid>
          <Grid item xs={12}>
            <LabelCustom title="Nhập mật khẩu mới" />
            <Controller
              key="newPassword"
              render={({ field }: any) => (
                <TextFieldCustom
                  errorMessage={errors?.newPassword?.message}
                  type={hiddenNewPassword ? "text" : "password"}
                  fullWidth
                  {...field}
                  inputProps={{ maxLength: 15 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment sx={{ cursor: "pointer" }} position="start">
                        <Box
                          onClick={() =>
                            hiddenNewPassword
                              ? setHiddenNewPassword(!hiddenNewPassword)
                              : setHiddenNewPassword(!hiddenNewPassword)
                          }
                        >
                          {hiddenNewPassword ? <Icons.eyes /> : <Icons.eyesHidden />}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              name="newPassword"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
                validate: (value: any) => {
                  const result = RegPassword(value);
                  return !value || result;
                },
              }}
              control={control}
              defaultValue=""
            />
          </Grid>
          <Grid item xs={12}>
            <LabelCustom title="Xác nhận mật khẩu mới" />
            <Controller
              key="confirmNewPassword"
              render={({ field }: any) => (
                <TextFieldCustom
                  errorMessage={errors?.confirmNewPassword?.message}
                  type={hiddenConfirmNewPassword ? "text" : "password"}
                  fullWidth
                  {...field}
                  inputProps={{ maxLength: 15 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment sx={{ cursor: "pointer" }} position="start">
                        {hiddenConfirmNewPassword ? (
                          <Box onClick={() => setHiddenConfirmNewPassword(!hiddenConfirmNewPassword)}>
                            <Icons.eyes />
                          </Box>
                        ) : (
                          <Box onClick={() => setHiddenConfirmNewPassword(!hiddenConfirmNewPassword)}>
                            <Icons.eyesHidden />
                          </Box>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              name="confirmNewPassword"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
                validate: (value: any) => value?.trim() === watch("newPassword") || MESSAGE_ERROR.watchPassword,
                // validate: (value: any) => {
                //   const result = RegPassword(value);
                //     return value?.trim() === watch('newPassword') || MESSAGE_ERROR.watchPassword || result;
                // }
              }}
              control={control}
              defaultValue=""
            />
          </Grid>
        </Grid>
      </CrudModal>
    </>
  );
};

export default CrudModalMyProfile;
