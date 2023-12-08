import { useRef, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { debounce } from "lodash";
import moment from "moment";
import { useSelector } from "react-redux";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";
import { STATUS_TOAST } from "../../consts/statusCode";
import { handleErrorMessage } from "../../utils/errorMessage";
import { useUploadFileService } from "../../services/upload-file.service";
import { useSetUserInformationState } from "../../redux/store/userInfo";
import LabelCustom from "../../components/LabelCustom";
import TextFieldCustom from "../../components/TextFieldCustom";
import { MESSAGE_ERROR } from "../../consts/messages";
import ButtonCustom from "../../components/ButtonCustom";
import { RegExpEmail, RegNumber, RegPhoneNumber } from "../../utils/regExp";
import DateTimePickerCustom from "../../components/DateTimePickerCustom";
import avatarDefault from "../../assets/images/avatar-default.png";
import "./my-profile.scss";
import ReactSelect from "../../components/ReactSelectView";
import CrudModalMyProfile from "./CrudModal";
import { useSetLoadingScreenState } from "../../redux/store/loadingScreen";
import apiService from "../../services/api-services";
import URL_PATHS from "../../services/url-path";

type FormInputs = {
  name: string;
  email: string;
  phone: string;
  image?: any;
  birthday?: Date;
  address?: string;
  gender?: any;
  role?: any;
};

export type IUploadFileResponse = {
  fileName: string;
  fileUrl: string;
}[];

const listGender = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
  { label: "Khác", value: "Khácm" },
];
const Profile = () => {
  const [isOpenChangePassWordModal, setIsOpenChangePassWordModal] = useState(false);
  const { setToastInformation } = useSetToastInformationState();
  const { setUserInformation } = useSetUserInformationState();
  const { setLoadingScreen } = useSetLoadingScreenState();
  // const { setCheckingChanges } = useSetCheckingChangesState();

  const [isOpenSendCodeModal, setIsOpenSendCodeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageErrorOTP, setMessageErrorOTP] = useState("");
  const [dataSubmit] = useState<any>({});
  const { currentUser } = useSelector((state: any) => state.currentUser);
  const isChangeForm = useSelector((state: any) => state.checkingChanges.isChange);
  const [previewImages, setPreviewImages] = useState<string>(currentUser.image || avatarDefault);
  const [newImage, setNewImage] = useState<string>(currentUser.image);
  const [changeFile, setChangeFile] = useState<boolean>(false);
  const [checkChangeFile, setCheckChangeFile] = useState<boolean>(false);
  const defaultValues = {
    name: currentUser?.name ? `${currentUser?.name}` : "",
    email: currentUser?.email ? `${currentUser?.email}` : "",
    phone: currentUser?.phone ? `${currentUser?.phone}` : "",
    image: currentUser?.image ? currentUser?.image : "",
    birthday: currentUser?.birthday ? currentUser?.birthday : null,
    address: currentUser?.address ? currentUser?.address : "",
    role: currentUser ? currentUser?.role : "",
    gender: currentUser
      ? listGender.find((x) => x.value?.toLocaleLowerCase() == currentUser?.gender?.toLocaleLowerCase())
      : "",
  };

  const {
    formState: { errors },
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    setFocus,
    getValues,
  } = useForm<FormInputs>({
    defaultValues: defaultValues,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const uploadFileService = useUploadFileService();

  const uploadImage = async (image: File) => {
    const bodyFormData = new FormData();
    bodyFormData.append("files", image);
    const resUpload = (await uploadFileService.uploadFileResources(bodyFormData)) as IUploadFileResponse;
    return resUpload;
  };

  const SubmitUpdateProfile = async (data: any) => {
    setLoadingScreen(true);
    const id = currentUser._id;
    let uploadImageRes: any;
    if (checkChangeFile === true) {
      uploadImageRes = await uploadImage(data.image);
    }

    const requestBody = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      birthday: data.birthday,
      address: data.address,
      role: data?.role?._id,
      gender: data.gender?.value,
      image: uploadImageRes?.downloadURL ? uploadImageRes?.downloadURL : newImage,
    };

    try {
      await apiService.put(`${URL_PATHS.CREATE_USER}/${id}`, requestBody);
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: "Cập nhập thông tin thành công",
      });
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      const userInfo = {
        ...currentUser,
        ...requestBody,
        role: currentUser.role,
      };
      setLoadingScreen(false);
      setUserInformation(userInfo);
    }
  };

  const SubmitErrors = () => {
    const error: any = Object.keys(errors)[0];
    setFocus(error, { shouldSelect: true });
  };

  const handleCloseChangePassWordModal = () => {
    setIsOpenChangePassWordModal(false);
  };

  const handleOpenChangePasswordModal = () => {
    setIsOpenChangePassWordModal(true);
  };

  const handleChangeFile = (file: File) => {
    setValue("image", file);
    trigger("image");
    setPreviewImages(URL.createObjectURL(file));
    setNewImage("");
    setChangeFile(true);
    setCheckChangeFile(true);
  };

  const handleDeleteImage = () => {
    setPreviewImages("");
    setNewImage("");
    setValue("image", "");
    setChangeFile(true);
    setCheckChangeFile(false);
  };

  const ImageSrc = `${currentUser.image}`;

  return (
    <>
      <p className="titleProfile">TÀI KHOẢN CỦA TÔI</p>
      <Grid
        style={{ borderRadius: "8px", marginLeft: "8px", width: "100%", background: "rgb(245, 245, 245)" }}
        container
        spacing={2}
      >
        <Grid item md={4} sm={12}>
          <Box style={{ width: "90%" }}>
            <Grid container spacing={2}>
              <Grid item md={4} sm={3}>
                {/* {previewImages && (
                  
                )} */}
                <img
                  className="imageProfile"
                  src={
                    changeFile
                      ? previewImages
                        ? previewImages
                        : avatarDefault
                      : currentUser.image
                      ? ImageSrc
                      : avatarDefault
                  }
                  alt="imageProfile"
                />
              </Grid>
              <Grid item md={8} sm={9}>
                <Controller
                  control={control}
                  name="image"
                  render={({ field: { onChange, value } }) => (
                    <input
                      accept="image/*"
                      ref={inputRef}
                      name="image"
                      type="file"
                      onChange={(e: any) => {
                        handleChangeFile(e.target.files[0]);
                      }}
                      // files={value}
                      style={{ display: "none" }}
                      // multiple={multiple}
                    />
                  )}
                />

                <ButtonCustom
                  title="Chọn ảnh đại diện"
                  color="white"
                  sx={{ marginTop: "5px" }}
                  onClick={() => {
                    if (inputRef.current) {
                      inputRef.current.click();
                    }
                  }}
                />

                <ButtonCustom title="Xóa ảnh" color="white" sx={{ marginTop: "5px" }} onClick={handleDeleteImage} />

                {/* </Box> */}
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item md={8} sm={12} sx={{ paddingRight: 2 }}>
          {/* <form> */}
          <Grid container spacing={1} sx={{ marginBottom: "10px" }}>
            <Grid item md={4}>
              <LabelCustom isRequired title="Họ và tên" />
              <Controller
                key="name"
                render={({ field, onChange }: any) => (
                  <TextFieldCustom
                    errorMessage={errors?.name?.message}
                    type="text"
                    fullWidth
                    {...field}
                    inputRef={field.ref}
                    inputProps={{ maxLength: 255 }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    onBlur={(e: any) => field.onChange(e.target.valuetrim())}
                  />
                )}
                name="name"
                rules={{
                  required: MESSAGE_ERROR.fieldRequired,
                }}
                control={control}
                defaultValue=""
              />
            </Grid>
            <Grid item md={0.5}></Grid>
            <Grid item md={4}>
              <LabelCustom title="Số điện thoại" isRequired />
              <Controller
                render={({ field }: any) => (
                  <TextFieldCustom
                    errorMessage={errors?.phone?.message}
                    type="text"
                    fullWidth
                    {...field}
                    inputProps={{ maxLength: 12 }}
                    inputRef={field.ref}
                    onBlur={(e: any) => field.onChange(e.target.value?.trim())}
                    onChange={(e: any) => {
                      field.onChange(e.target.value);
                    }}
                  />
                )}
                name="phone"
                rules={{
                  required: MESSAGE_ERROR.fieldRequired,
                  validate: (value: any) => {
                    const result = RegPhoneNumber(value);
                    return !value || result || MESSAGE_ERROR.RegPhoneNumber;
                  },
                }}
                control={control}
                defaultValue=""
              />
            </Grid>
            <Grid item md={4} mt={1}>
              <LabelCustom title="Email" isRequired />
              <Controller
                control={control}
                name="email"
                defaultValue=""
                rules={{
                  required: MESSAGE_ERROR.fieldRequired,
                  validate: (value: any) => {
                    const result = RegExpEmail(value);
                    return !value || result || MESSAGE_ERROR.RegExpEmail;
                  },
                }}
                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                  <>
                    <TextFieldCustom
                      ref={ref}
                      placeholder="Email"
                      value={value}
                      errorMessage={error?.message}
                      onBlur={(e) => onChange(e.target.value.trim())}
                      inputProps={{
                        maxLength: 50,
                      }}
                      disabled
                      onChange={(e) => {
                        onChange(e.target.value);
                      }}
                    />
                  </>
                )}
              />
            </Grid>
            <Grid item md={0.5}></Grid>
            <Grid item md={4} mt={1}>
              <LabelCustom title="Ngày sinh" isRequired />
              <Controller
                control={control}
                name="birthday"
                defaultValue={currentUser?.birthday ? currentUser?.birthday : null}
                rules={{
                  required: MESSAGE_ERROR.fieldRequired,
                }}
                render={({ field: { onChange, value } }) => (
                  <DateTimePickerCustom
                    inputFormat="DD/MM/YYYY"
                    onChange={onChange}
                    value={value}
                    disableFuture={true}
                    inputProps={{
                      errorMessage: errors?.birthday?.message,
                    }}
                    staticDateTimePickerProps={{
                      views: ["year", "day"],
                      ampm: true,
                    }}
                    sx={{
                      "& input": {
                        fontSize: "14px",
                        color: "#614C4C",
                        fontWeight: 400,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item md={4} mt={1}>
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
                    isValidationFailed
                    errorMessage={errors?.gender?.message as string}
                  />
                )}
              />
            </Grid>
            <Grid item md={0.5} mt={1}></Grid>
            <Grid item md={4} mt={1}>
              <LabelCustom title="Địa chỉ" />
              <Controller
                key="address"
                render={({ field }: any) => (
                  <TextFieldCustom
                    errorMessage={errors?.address?.message}
                    type="text"
                    fullWidth
                    {...field}
                    inputRef={field.ref}
                    inputProps={{ maxLength: 255 }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    onBlur={(e: any) => field.onChange(e.target.trim())}
                  />
                )}
                name="address"
                control={control}
                defaultValue=""
              />
            </Grid>
            <Grid item xs={12} mt={1}>
              <ButtonCustom
                onClick={handleSubmit(SubmitUpdateProfile, SubmitErrors)}
                loading={isLoading}
                title="Cập nhật"
                color="yellow"
              />
              <ButtonCustom title="Đổi mật khẩu" onClick={handleOpenChangePasswordModal} color="white" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        style={{
          borderRadius: "8px",
          marginLeft: "8px",
          marginTop: "8px",
          width: "100%",
          background: "rgb(245, 245, 245)",
        }}
        container
        spacing={2}
      >
        <Grid style={{ alignItems: "center" }} item md={4} sm={3}>
          <p className="titleInfo">Phân Quyền</p>
        </Grid>
        <Grid item md={8} sm={9}>
          <p className="titleInfo">{currentUser?.role?.roleName}</p>
        </Grid>
      </Grid>
      {isOpenChangePassWordModal && (
        <CrudModalMyProfile
          setIsOpenChangePassWordModal={setIsOpenChangePassWordModal}
          isOpen={isOpenChangePassWordModal}
          handleClose={handleCloseChangePassWordModal}
          cancelBtnLabel="Hủy"
          saveBtnLabel="Cập nhật"
          formTitle="Đổi mật khẩu"
        />
      )}
    </>
  );
};

export default Profile;
