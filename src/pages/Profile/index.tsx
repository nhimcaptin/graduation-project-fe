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

type FormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  otpCode: string;
  avatar: any;
  image?: string[];
  birthDate?: Date;
  province?: any;
  district?: any;
  ward?: any;
  address?: string;
};

interface LocationAttributes {
  resPath: string;
  urlPath: string;
}

export type IUploadFileResponse = {
  fileName: string;
  fileUrl: string;
}[];

const getLocationSelectedValue = (name: string | null) => {
  return name ? { label: name, value: name } : null;
};
const Profile = () => {
  const [isOpenChangePassWordModal, setIsOpenChangePassWordModal] = useState(false);
  const { setToastInformation } = useSetToastInformationState();
  const { setUserInformation } = useSetUserInformationState();
  // const { setCheckingChanges } = useSetCheckingChangesState();

  const [isOpenSendCodeModal, setIsOpenSendCodeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageErrorOTP, setMessageErrorOTP] = useState("");
  const [dataSubmit] = useState<any>({});
  const { currentUser } = useSelector((state: any) => state.currentUser);
  const isChangeForm = useSelector((state: any) => state.checkingChanges.isChange);
  const [previewImages, setPreviewImages] = useState<string>(currentUser.avatar || avatarDefault);
  const [newImage, setNewImage] = useState<string>(currentUser.avatar);
  const [changeFile, setChangeFile] = useState<boolean>(false);
  const [checkChangeFile, setCheckChangeFile] = useState<boolean>(false);
  const defaultValues = {
    firstName: currentUser?.firstName ? `${currentUser?.firstName}` : "",
    lastName: currentUser?.lastName ? `${currentUser?.lastName}` : "",
    email: currentUser?.email ? `${currentUser?.email}` : "",
    phoneNumber: currentUser?.phoneNumber ? `${currentUser?.phoneNumber}` : "",
    userName: currentUser?.userName ? `${currentUser?.userName}` : "",
    otpCode: "123456",
    avatar: currentUser?.avatar ? currentUser?.avatar : "",
    birthDate: currentUser?.birthDate ? currentUser?.birthDate : null,
    district: currentUser?.districtName ? currentUser?.districtName : "",
    ward: currentUser?.wardName ? currentUser?.wardName : "",
    province: currentUser?.provinceName ? currentUser?.provinceName : "",
    address: currentUser?.address ? currentUser?.address : "",
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
    const id = currentUser.id;
    setIsLoading(true);
    let uploadImageRes: any = [];
    if (checkChangeFile === true) {
      uploadImageRes = await uploadImage(data.avatar);
    }

    const requestBody = {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email || null,
      birthDate: data.birthDate || null,
      address: data.address,
      wardName: data.ward || null,
      districtName: data.district || null,
      provinceName: data.province || null,
      otpCode: "123456",
      avatar: uploadImageRes[0]?.fileUrl ? uploadImageRes[0]?.fileUrl : newImage,
    };

    try {
      //   await UpdateProfile(requestBody, id);
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: "Cập nhập thông tin thành công",
      });
      handleCloseSendCode();
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      const userInfo = {
        ...currentUser,
        ...requestBody,
      };
      setIsLoading(false);
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

  const handleCloseSendCode = () => {
    setIsOpenSendCodeModal(false);
    setValue("otpCode", "");
    setMessageErrorOTP("");
  };

  const handleOpenChangePasswordModal = () => {
    setIsOpenChangePassWordModal(true);
  };

  const handleChange = (otp: any) => {
    setValue("otpCode", otp);
  };

  const handleBlurTextField = async (fieldName: keyof FormInputs, value: string) => {
    await trigger(fieldName);
    setValue(fieldName, value);
  };

  const handleChangeFile = (file: File) => {
    setValue("avatar", file);
    trigger("avatar");
    setPreviewImages(URL.createObjectURL(file));
    setNewImage("");
    setChangeFile(true);
    setCheckChangeFile(true);
  };

  const handleDeleteImage = () => {
    setPreviewImages("");
    setNewImage("");
    setValue("avatar", "");
    setChangeFile(true);
    setCheckChangeFile(false);
  };

  const [locationParams, setLocationParams] = useState({
    provinceId: "",
    districtId: "",
    wardId: "",
    provinceName: "",
    districtName: "",
    wardName: "",
  });

  const ImageSrc = `${currentUser.avatar}`;

  return (
    <>
      <p className="titleProfile">TÀI KHOẢN CỦA TÔI</p>
      <Grid
        style={{ background: "#F5F5F5", borderRadius: "8px", marginLeft: "0px", width: "100%" }}
        container
        spacing={2}
      >
        <Grid item md={4} sm={12}>
          <p className="titleInfo">Thông tin tài khoản</p>
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
                      : currentUser.avatar
                      ? ImageSrc
                      : avatarDefault
                  }
                  alt="imageProfile"
                />
              </Grid>
              <Grid item md={8} sm={9}>
                <p className="fullNameProfile">
                  {currentUser?.lastName && currentUser?.firstName ? `${currentUser?.firstName}` : ""}
                </p>
                <p className="emailProfile">{currentUser?.email}</p>

                <Controller
                  control={control}
                  name="avatar"
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
            <Grid item md={4} sm={6}>
              <LabelCustom isRequired title="Họ và tên" />
              <Controller
                key="firstName"
                render={({ field }: any) => (
                  <TextFieldCustom
                    errorMessage={errors?.firstName?.message}
                    type="text"
                    fullWidth
                    {...field}
                    inputRef={field.ref}
                    inputProps={{ maxLength: 255 }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    onBlur={(e: any) => handleBlurTextField("firstName", e.target.value.trim())}
                  />
                )}
                name="firstName"
                rules={{
                  required: MESSAGE_ERROR.fieldRequired,
                }}
                control={control}
                defaultValue=""
              />
            </Grid>
            <Grid item md={4} sm={6}>
              <LabelCustom title="Số điện thoại" />
              <Controller
                render={({ field }: any) => (
                  <TextFieldCustom
                    errorMessage={errors?.phoneNumber?.message}
                    type="text"
                    fullWidth
                    {...field}
                    inputProps={{ maxLength: 12 }}
                    inputRef={field.ref}
                    onBlur={(e: any) => handleBlurTextField("phoneNumber", e.target.value.trim())}
                    onChange={(e: any) => {
                      if (e.target.value === "" || RegNumber.test(e.target.value)) {
                        field.onChange(e.target.value);
                      }
                    }}
                  />
                )}
                name="phoneNumber"
                rules={{
                  validate: (value: any) => {
                    const result = RegPhoneNumber(value);
                    return !value || result || MESSAGE_ERROR.RegPhoneNumber;
                  },
                }}
                control={control}
                defaultValue=""
              />
            </Grid>
            <Grid item md={4} sm={6}>
              <LabelCustom title="Tên đăng nhập" />
              <Controller
                render={({ field }: any) => (
                  <TextFieldCustom errorMessage={errors?.userName?.message} disabled type="text" fullWidth {...field} />
                )}
                name="userName"
                control={control}
                defaultValue=""
              />
            </Grid>
            <Grid item md={4} sm={6}>
              <LabelCustom title="Email" />
              <Controller
                control={control}
                name="email"
                defaultValue=""
                rules={{
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
                      onChange={(e) => {
                        onChange(e.target.value);
                      }}
                    />
                  </>
                )}
              />
            </Grid>
            <Grid item md={4} sm={6}>
              <LabelCustom title="Ngày sinh" />
              <Controller
                control={control}
                name="birthDate"
                defaultValue={currentUser?.birthDate ? currentUser?.birthDate : null}
                render={({ field: { onChange, value } }) => (
                  <DateTimePickerCustom
                    inputFormat="DD/MM/YYYY"
                    onChange={onChange}
                    value={value}
                    disableFuture={true}
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
            <Grid item md={4} sm={6}>
              <LabelCustom title="Địa chỉ" />
              <Controller
                key="address"
                render={({ field }: any) => (
                  <TextFieldCustom
                    errorMessage={errors?.lastName?.message}
                    type="text"
                    fullWidth
                    {...field}
                    inputRef={field.ref}
                    inputProps={{ maxLength: 255 }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    onBlur={(e: any) => handleBlurTextField("address", e.target.value.trim())}
                  />
                )}
                name="address"
                control={control}
                defaultValue=""
              />
            </Grid>
            <Grid item xs={12}>
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
      {/* {isOpenChangePassWordModal && (
        <CrudModalMyProfile
          setIsOpenChangePassWordModal={setIsOpenChangePassWordModal}
          isOpen={isOpenChangePassWordModal}
          handleClose={handleCloseChangePassWordModal}
          cancelBtnLabel="Hủy"
          saveBtnLabel="Cập nhật"
          formTitle="Đổi mật khẩu"
        />
      )} */}
    </>
  );
};

export default Profile;
