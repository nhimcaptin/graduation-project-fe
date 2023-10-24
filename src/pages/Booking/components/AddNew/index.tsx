import React, { useState } from "react";
import CrudModal from "../../../../components/CrudModal";
import { Grid } from "@mui/material";
import LabelCustom from "../../../../components/LabelCustom";
import { Controller, useForm } from "react-hook-form";
import TextFieldCustom from "../../../../components/TextFieldCustom";
import { MESSAGES_CONFIRM, MESSAGE_ERROR, MESSAGE_SUCCESS } from "../../../../consts/messages";
import apiService from "../../../../services/api-services";
import URL_PATHS from "../../../../services/url-path";
import { useSetToastInformationState } from "../../../../redux/store/ToastMessage";
import { handleErrorMessage } from "../../../../utils/errorMessage";
import { STATUS_TOAST } from "../../../../consts/statusCode";
import ReactSelect from "../../../../components/ReactSelectView";
import FocusHiddenInput from "../../../../components/FocusHiddenInput";
import SunEditorShare from "../../../../components/SunEditorStyled";
import { stripHTML } from "../../../../utils";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";

interface PropsType {
  isOpen: boolean;
  dataDetail: any;
  title: string;
  onCancel: () => void;
  getData: (params: any) => void;
  isEdit: boolean;
}

const AddUser = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel, getData, dataDetail } = props;
  const { setToastInformation } = useSetToastInformationState();

  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: dataDetail ? dataDetail?.description : "",
      //   email: dataDetail ? dataDetail?.email : "",
      //   phone: dataDetail ? dataDetail?.phone : "",
      //   address: dataDetail ? dataDetail?.address : "",
      role: dataDetail ? dataDetail?.role : "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (!!dataDetail) {
        await apiService.put(`${URL_PATHS.CREATE_USER}/${dataDetail?._id}`, data);
        setToastInformation({
          status: STATUS_TOAST.SUCCESS,
          message: MESSAGE_SUCCESS.EDIT_USER,
        });
      } else {
        await apiService.post(URL_PATHS.CREATE_USER, data);
        setToastInformation({
          status: STATUS_TOAST.SUCCESS,
          message: MESSAGE_SUCCESS.CREATE_USER,
        });
      }

      onCancel && onCancel();
      getData && getData({});
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEditorNewValue = (newValue: string) => {
    const stripedValue = stripHTML(newValue).trim();
    if (stripedValue.length === 1 && stripedValue.charCodeAt(0) === 8203) return "";
    return stripedValue === "" ? "" : newValue;
  };

  return (
    <CrudModal
      isOpen={isOpen}
      formTitle={title}
      handleSave={isEdit ? handleSubmit(onSubmit) : undefined}
      handleClose={onCancel}
      cancelBtnLabel="Hủy"
      saveBtnLabel="Lưu"
      loading={isLoading}
      dialogProps={{
        fullWidth: true,
        maxWidth: "md",
      }}
    >
      <Grid container>
        <Grid item xs={12} mt={1}>
          <LabelCustom title="Mô tả chi tiết" isRequired />
          <Controller
            control={control}
            name="description"
            rules={{ required: MESSAGE_ERROR.fieldRequired }}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <>
                <FocusHiddenInput ref={ref}></FocusHiddenInput>
                <SunEditorShare
                  hideToolbarSunEditor={!isEdit}
                  disableSunEditor={!isEdit}
                  onChangeEditorState={(newValue: any) => onChange(getEditorNewValue(newValue))}
                  setContents={value || ""}
                  minHeight="400px"
                  errorEditor={!!errors?.description?.message}
                  onBlur={(e: any, content: any) => {
                    onBlur();
                    onChange((content || "").trim());
                  }}
                />
              </>
            )}
          />
          {errors?.description && (
            <ErrorMessage style={{ marginTop: "-10px" }}>{errors?.description?.message}</ErrorMessage>
          )}
        </Grid>
      </Grid>
    </CrudModal>
  );
};

export default AddUser;
