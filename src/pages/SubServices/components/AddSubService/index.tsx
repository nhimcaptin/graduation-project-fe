import { Grid } from "@mui/material";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CrudModal from "../../../../components/CrudModal";
import LabelCustom from "../../../../components/LabelCustom";
import TextFieldCustom from "../../../../components/TextFieldCustom";
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from "../../../../consts/messages";
import ReactSelect from "../../../../components/ReactSelectView";
import URL_PATHS from "../../../../services/url-path";
import apiService from "../../../../services/api-services";
import PriceInput from "../../../../components/PriceInput";
import FocusHiddenInput from "../../../../components/FocusHiddenInput";
import { ButtonAddFileMainSelect } from "../../../../components/ButtonAddFile/ButtonAddFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useSetLoadingScreenState } from "../../../../redux/store/loadingScreen";
import { useSetToastInformationState } from "../../../../redux/store/ToastMessage";
import { STATUS_TOAST } from "../../../../consts/statusCode";
import { handleErrorMessage } from "../../../../utils/errorMessage";
import { useUploadFileService } from "../../../../services/upload-file.service";
import { isEmpty } from "lodash";
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

const listAesthetics = [
  {
    value: "Tốt",
    label: "Tốt",
  },
  {
    value: "Khá",
    label: "Khá",
  },
  {
    value: "Trung bình",
    label: "Trung bình",
  },
];

const AddSubService = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel, getData, dataDetail } = props;
  const { setLoadingScreen } = useSetLoadingScreenState();
  const { setToastInformation } = useSetToastInformationState();
  const uploadFileService = useUploadFileService();

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: dataDetail ? dataDetail?.name : "",
      price: dataDetail ? dataDetail?.price : "",
      mainServiceID: dataDetail
        ? { label: dataDetail?.mainServiceID?.name, value: dataDetail?.mainServiceID?._id }
        : "",
      aesthetics: dataDetail ? listAesthetics.find((x) => x.value === dataDetail?.aesthetics) : "",
      treatmentTime: dataDetail ? dataDetail?.treatmentTime : "",
      examination: dataDetail ? dataDetail?.examination : "",
      image: dataDetail ? dataDetail?.image : "",
      description: dataDetail ? dataDetail?.description : "",
    },
  });

  const getMainServiceOptions = async (searchText: string, page: number, perPage: number) => {
    const params = {
      page,
      perPage,
    };

    const filters = {
      name: searchText,
    };
    try {
      const res: any = await apiService.getFilter(URL_PATHS.GET_LIST_MAIN_SERVICE, params, filters);
      const resultItems: any[] = res?.mainServices;
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
    }
  };

  const refProps = useRef<any>(null);
  const isCheckImage = (data: any) => {
    const image = data ? [{ imageUrl: data }] : [];
    return image;
  };
  const [previewImages, setPreviewImages] = useState<any>(dataDetail ? isCheckImage(dataDetail?.image) : []);
  const handleChangeImage = (newFileList: any) => {
    if (newFileList) setValue("image", newFileList);
    setPreviewImages([]);
    trigger("image");
  };

  const uploadImage = async (image: File) => {
    const bodyFormData = new FormData();
    bodyFormData.append("files", image);
    const resUpload = await uploadFileService.uploadFileResources(bodyFormData);
    return resUpload;
  };

  const onSubmit = async (data: any) => {
    const _data = {
      ...data,
      mainServiceID: data?.mainServiceID?.value,
      aesthetics: data?.aesthetics?.value,
    };

    setLoadingScreen(true);
    try {
      let imageUrl;
      if (data?.image && data?.image[0] && data?.image[0]?.file) {
        const uploadImageRes = (await uploadImage(data?.image[0].file as File)) as any;
        imageUrl = uploadImageRes.downloadURL?.length > 0 ? uploadImageRes.downloadURL : "";
      } else {
        imageUrl = isEmpty(data?.image) ? "" : data?.image;
      }
      _data.image = imageUrl;
      if (dataDetail) {
        await apiService.put(URL_PATHS.UPDATE_SUB_SERVICE + "/" + dataDetail?._id, _data);
      } else {
        await apiService.post(URL_PATHS.CREATE_SUB_SERVICE, _data);
      }
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: dataDetail ? MESSAGE_SUCCESS.EDIT_SUB_SERVICE : MESSAGE_SUCCESS.CREATE_SUB_SERVICE,
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
                    onChange(getEditorNewValue(content));
                  }}
                  ref={ref}
                />
              </>
            )}
          />
          {errors?.description && (
            <ErrorMessage style={{ marginTop: "-10px" }}>{errors?.description?.message}</ErrorMessage>
          )}
        </Grid>
        <Grid item xs={12} mt={1}>
          <LabelCustom title="Ảnh" />
          <Controller
            name="image"
            control={control}
            render={({ field: { ref } }) => {
              return (
                <>
                  <FocusHiddenInput ref={ref}></FocusHiddenInput>
                  <ButtonAddFileMainSelect
                    onChange={(files) => {
                      handleChangeImage(files);
                    }}
                    isViewMode={!isEdit}
                    refForm={refProps}
                    icon={<AddPhotoAlternateIcon sx={{ fontSize: "20px", color: "#614C4C" }} />}
                    title="Chọn ảnh"
                    formProps={{ control }}
                    initialUrls={previewImages}
                    multiple={false}
                    error={!!errors.image && errors.image.message}
                    sizeLimit={2}
                  />
                </>
              );
            }}
          />
        </Grid>
        <Grid container item xs={12} sx={{ marginTop: "15px" }}>
          <Grid item xs={5}>
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
                  placeholder="Nhập dịch vụ"
                  type="text"
                  errorMessage={errors?.name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={5}>
            <LabelCustom title="Danh mục" isRequired />
            <Controller
              control={control}
              name="mainServiceID"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <ReactSelect
                  isClearable
                  getOptions={getMainServiceOptions}
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.value}
                  value={value}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  fieldName={name}
                  maxMenuHeight={150}
                  placeholder="Chọn danh mục"
                  menuPlacement={"bottom"}
                  inputRef={ref}
                  isValidationFailed
                  isDisabled={!isEdit}
                  errorMessage={errors?.mainServiceID?.message as string}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} sx={{ marginTop: "15px" }}>
          <Grid item xs={5}>
            <LabelCustom title="Chi phí" isRequired />
            <Controller
              control={control}
              name="price"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <PriceInput
                  placeholder="Nhập chi phí"
                  disabled={!isEdit}
                  value={value}
                  handleChange={onChange}
                  onChange={onChange}
                  errorMessage={errors?.price?.message}
                  inputProps={{ maxLength: 15 }}
                  isVND
                />
              )}
            />
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={5}>
            <LabelCustom title="Tính thẩm mĩ" isRequired />
            <Controller
              control={control}
              name="aesthetics"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <ReactSelect
                  isClearable
                  options={listAesthetics}
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.value}
                  value={value}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  fieldName={name}
                  maxMenuHeight={200}
                  placeholder="Chọn tính thẩm mĩ"
                  inputRef={ref}
                  isValidationFailed
                  isDisabled={!isEdit}
                  errorMessage={errors?.aesthetics?.message as string}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} sx={{ marginTop: "15px" }}>
          <Grid item xs={5}>
            <LabelCustom title="Thời gian điều trị" isRequired />
            <Controller
              control={control}
              name="treatmentTime"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <PriceInput
                  placeholder="Nhập thời gian điều trị"
                  disabled={!isEdit}
                  value={value}
                  handleChange={onChange}
                  onChange={onChange}
                  errorMessage={errors?.treatmentTime?.message}
                  inputProps={{ maxLength: 15 }}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={5}>
            <LabelCustom title="Thời gian thăm khám" isRequired />
            <Controller
              control={control}
              name="examination"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <PriceInput
                  placeholder="Nhập thời gian thăm khám"
                  disabled={!isEdit}
                  value={value}
                  handleChange={onChange}
                  onChange={onChange}
                  errorMessage={errors?.examination?.message}
                  inputProps={{ maxLength: 15 }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Grid>
    </CrudModal>
  );
};

export default AddSubService;
