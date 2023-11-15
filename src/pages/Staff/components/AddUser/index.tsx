import React, { useRef, useState } from "react";
import CrudModal from "../../../../components/CrudModal";
import { Grid } from "@mui/material";
import LabelCustom from "../../../../components/LabelCustom";
import { Controller, useForm } from "react-hook-form";
import TextFieldCustom from "../../../../components/TextFieldCustom";
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from "../../../../consts/messages";
import ReactSelect from "../../../../components/ReactSelectView";
import { useSetToastInformationState } from "../../../../redux/store/ToastMessage";
import apiService from "../../../../services/api-services";
import URL_PATHS from "../../../../services/url-path";
import { STATUS_TOAST } from "../../../../consts/statusCode";
import { handleErrorMessage } from "../../../../utils/errorMessage";
import { RegExpEmail, RegPhoneNumber } from "../../../../utils/regExp";
import FocusHiddenInput from "../../../../components/FocusHiddenInput";
import { ButtonAddFileMainSelect } from "../../../../components/ButtonAddFile/ButtonAddFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DateTimePickerCustom from "../../../../components/DateTimePickerCustom";
import { useUploadFileService } from "../../../../services/upload-file.service";
import { isEmpty } from "lodash";
import { useSetLoadingScreenState } from "../../../../redux/store/loadingScreen";

interface PropsType {
  isOpen: boolean;
  dataDetail: any;
  title: string;
  onCancel: () => void;
  getData: (params: any) => void;
  isEdit: boolean;
}

const listGender = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
  { label: "Khác", value: "Khácm" },
];

const AddUser = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel, getData, dataDetail } = props;
  const { setToastInformation } = useSetToastInformationState();
  const uploadFileService = useUploadFileService();
  const { setLoadingScreen } = useSetLoadingScreenState();

  const refProps = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);

  const isCheckImage = (data: any) => {
    const image = data ? [{ imageUrl: data }] : [];
    return image;
  };
  const [previewImages, setPreviewImages] = useState<any>(dataDetail ? isCheckImage(dataDetail?.image) : []);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: dataDetail ? dataDetail?.name : "",
      email: dataDetail ? dataDetail?.email : "",
      phone: dataDetail ? dataDetail?.phone : "",
      address: dataDetail ? dataDetail?.address : "",
      role: dataDetail ? dataDetail?.role : "",
      image: dataDetail ? dataDetail?.image : "",
      birthday: dataDetail ? dataDetail?.birthday : "",
      gender: dataDetail ? listGender.find((x) => x.value == dataDetail?.gender) : "",
    },
  });

  const handleChangeImage = (newFileList: any) => {
    if (newFileList) setValue("image", newFileList);
    setPreviewImages([]);
    trigger("image");
  };

  const getCustomerGroupOptions = async (searchText: string, page: number, perPage: number) => {
    setIsLoadingSelect(true);
    const params = {
      page,
      perPage,
    };

    const filters = {
      name: searchText,
    };
    try {
      const res: any = await apiService.getFilter(URL_PATHS.ROLE_GET, params, filters);
      const resultItems: any[] = res?.data;
      if (resultItems.length >= 0) {
        const items: any[] = resultItems.map((item) => {
          const result = {
            ...item,
            label: item?.roleName || "",
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
      setIsLoadingSelect(false);
    }
  };

  const uploadImage = async (image: File) => {
    const bodyFormData = new FormData();
    bodyFormData.append("files", image);
    const resUpload = await uploadFileService.uploadFileResources(bodyFormData);
    return resUpload;
  };

  const onSubmit = async (data: any) => {
    setLoadingScreen(true);
    try {
      let imageUrl;
      if (data?.image && data.image[0] && data.image[0]?.file) {
        const uploadImageRes = (await uploadImage(data.image[0].file as File)) as any;
        imageUrl = uploadImageRes.downloadURL;
      } else {
        imageUrl = isEmpty(data?.image) ? "" : data?.image;
      }
      data.image = imageUrl;
      data.gender = data?.gender?.value;
      if (!!dataDetail) {
        await apiService.put(`${URL_PATHS.CREATE_USER}/${dataDetail?._id}`, { ...data, role: data?.role?.value });
        setToastInformation({
          status: STATUS_TOAST.SUCCESS,
          message: MESSAGE_SUCCESS.EDIT_STAFF,
        });
      } else {
        await apiService.post(URL_PATHS.CREATE_USER, { ...data, role: data?.role?.value });
        setToastInformation({
          status: STATUS_TOAST.SUCCESS,
          message: MESSAGE_SUCCESS.CREATE_STAFF,
        });
      }
      onCancel && onCancel();
      getData && getData({ highlightId: dataDetail?._id });
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
      loading={isLoading}
      dialogProps={{
        fullWidth: true,
        maxWidth: "md",
      }}
    >
      <Grid container>
        <Grid item xs={12} mt={1}>
          <LabelCustom title="Avatar" />
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
        <Grid container item xs={12} mt={2}>
          <Grid item xs={5}>
            <LabelCustom title="Họ và tên" isRequired />
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
          <Grid item xs={2}></Grid>
          <Grid item xs={5}>
            <LabelCustom title="Ngày sinh" isRequired />
            <Controller
              control={control}
              name="birthday"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <DateTimePickerCustom
                  inputProps={{
                    errorMessage: errors?.birthday?.message,
                  }}
                  staticDateTimePickerProps={{
                    disabled: !isEdit,
                    minDateTime: new Date(),
                    views: ["year", "day"],
                    ampm: true,
                  }}
                  value={value}
                  onChange={(e: any) => {
                    onChange(e);
                  }}
                  inputFormat="DD/MM/YYYY"
                  placeholder="DD/MM/YYYY"
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} mt={2}>
          <Grid item xs={5}>
            <LabelCustom title="Giới tính" isRequired />
            <Controller
              control={control}
              name="gender"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <ReactSelect
                  isClearable
                  options={listGender}
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.value}
                  value={value}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  fieldName={name}
                  maxMenuHeight={200}
                  placeholder="Chọn giới tính"
                  inputRef={ref}
                  isDisabled={!isEdit}
                  isValidationFailed
                  errorMessage={errors?.gender?.message as string}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={5}>
            <LabelCustom title="Email" isRequired />
            <Controller
              control={control}
              name="email"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
                validate: (value: any) => {
                  const result = RegExpEmail(value);
                  return !value || result || MESSAGE_ERROR.RegExpEmail;
                },
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <TextFieldCustom
                  name={name}
                  ref={ref}
                  value={value}
                  onChange={onChange}
                  placeholder="Nhập email"
                  disabled={!isEdit}
                  type="text"
                  errorMessage={errors?.email?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} sx={{ marginTop: "15px" }}>
          <Grid item xs={5}>
            <LabelCustom title="Số điện thoại" isRequired />
            <Controller
              control={control}
              name="phone"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
                validate: (value: any) => {
                  const result = RegPhoneNumber(value);
                  return !value || result || MESSAGE_ERROR.RegPhoneNumber;
                },
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <TextFieldCustom
                  name={name}
                  ref={ref}
                  value={value}
                  onChange={onChange}
                  placeholder="Nhập số điện thoại"
                  disabled={!isEdit}
                  type="text"
                  errorMessage={errors?.phone?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={5}>
            <LabelCustom title="Vai trò" isRequired />
            <Controller
              control={control}
              name="role"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <ReactSelect
                  isClearable
                  getOptions={(searchText: string, page: number, perPage: number) =>
                    getCustomerGroupOptions(searchText, page, perPage)
                  }
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
                  isLoading={isLoadingSelect}
                  errorMessage={errors?.role?.message as string}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} sx={{ marginTop: "15px" }}>
          <Grid item xs={5}>
            <LabelCustom title="Địa chỉ" isRequired />
            <Controller
              control={control}
              name="address"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <TextFieldCustom
                  name={name}
                  ref={ref}
                  value={value}
                  onChange={onChange}
                  placeholder="Nhập địa chỉ"
                  disabled={!isEdit}
                  type="text"
                  errorMessage={errors?.address?.message}
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
