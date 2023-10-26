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
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: dataDetail ? dataDetail?.description : "",
      patient: dataDetail ? dataDetail?.patient : "",
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

  const getPatientOptions = async (searchText: string, page: number, perPage: number) => {
    setIsLoadingPatient(true)
    const params = {
      page,
      perPage,
    };

    const filters = {
      name: searchText,
      equals: { isAdmin: "false" },
    };
    try {
      const res: any = await await apiService.getFilter(URL_PATHS.GET_USER, params, filters);
      const resultItems: any[] = res?.data;
      if (resultItems.length >= 0) {
        const items: any[] = resultItems.map((item) => {
          const result = {
            ...item,
            label: item?.name || "",
            value: item?._id || "",
          };
          return result;
        });
        return {
          options: items,
          hasMore: res?.totalUsers / perPage > page,
        };
      }
      return {
        options: [],
        hasMore: false,
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    } finally {
      setIsLoadingPatient(false)
    }
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
          <LabelCustom title="Mô tả chi tiết" />
          <Controller
            control={control}
            name="description"
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
        <Grid container item xs={12} sx={{ marginTop: "15px" }}>
          <Grid item xs={5}>
            <LabelCustom title="Bệnh nhân" isRequired />
            <Controller
              control={control}
              name="patient"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <ReactSelect
                  isClearable
                  getOptions={getPatientOptions}
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.value}
                  value={value}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  fieldName={name}
                  maxMenuHeight={200}
                  placeholder="Chọn vai trò"
                  inputRef={ref}
                  isValidationFailed
                  isDisabled={!isEdit}
                  isLoading={isLoadingPatient}
                />
              )}
            />
          </Grid>
        </Grid>
      </Grid>
    </CrudModal>
  );
};

export default AddUser;
