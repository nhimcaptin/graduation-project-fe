import { Grid } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CrudModal from "../../../../components/CrudModal";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage";
import FocusHiddenInput from "../../../../components/FocusHiddenInput";
import LabelCustom from "../../../../components/LabelCustom";
import SunEditorShare from "../../../../components/SunEditorStyled";
import TextFieldCustom from "../../../../components/TextFieldCustom";
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from "../../../../consts/messages";
import { stripHTML } from "../../../../utils";
import { useSetLoadingScreenState } from "../../../../redux/store/loadingScreen";
import moment from "moment";
import URL_PATHS from "../../../../services/url-path";
import { useSetToastInformationState } from "../../../../redux/store/ToastMessage";
import apiService from "../../../../services/api-services";
import { STATUS_TOAST } from "../../../../consts/statusCode";
import { handleErrorMessage } from "../../../../utils/errorMessage";

interface PropsType {
  isOpen: boolean;
  dataDetail: any;
  title: string;
  onCancel: () => void;
  getData: (params: any) => void;
  isEdit: boolean;
}

const AddMainService = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel, getData, dataDetail } = props;
  const { setLoadingScreen } = useSetLoadingScreenState();
  const { setToastInformation } = useSetToastInformationState();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { description: dataDetail ? dataDetail?.description : "", name: dataDetail ? dataDetail?.name : "" },
  });

  const getEditorNewValue = (newValue: string) => {
    const stripedValue = stripHTML(newValue).trim();
    if (stripedValue.length === 1 && stripedValue.charCodeAt(0) === 8203) return "";
    return stripedValue === "" ? "" : newValue;
  };

  const onSubmit = async (data: any) => {
    setLoadingScreen(true);
    try {
      if (dataDetail) {
        await apiService.put(URL_PATHS.UPDATE_MAIN_SERVICE + "/" + dataDetail?._id, data);
      } else {
        await apiService.post(URL_PATHS.CREATE_MAIN_SERVICE, data);
      }
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: dataDetail ? MESSAGE_SUCCESS.EDIT_MAIN_SERVICE : MESSAGE_SUCCESS.CREATE_MAIN_SERVICE,
      });
      onCancel && onCancel();
      getData && getData({});
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setLoadingScreen(false);
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
      dialogProps={{
        fullWidth: true,
        maxWidth: "md",
      }}
    >
      <Grid container>
        <Grid item xs={12} mt={2}>
          <LabelCustom title="Tên dịch vụ" isRequired />
          <Controller
            control={control}
            name="name"
            rules={{
              required: MESSAGE_ERROR.fieldRequired,
            }}
            render={({ field: { onChange, onBlur, value, ref, name } }) => (
              <TextFieldCustom
                name={name}
                ref={ref}
                value={value}
                onChange={onChange}
                disabled={!isEdit}
                placeholder="Nhập họ và tên"
                type="text"
                errorMessage={errors?.name?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} mt={1}>
          <LabelCustom title="Mô tả chi tiết" />
          <Controller
            control={control}
            name="description"
            rules={{
              required: MESSAGE_ERROR.fieldRequired,
            }}
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

export default AddMainService;
