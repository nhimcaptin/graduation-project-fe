import React, { useEffect, useRef, useState } from "react";
import CrudModal from "../../../../components/CrudModal";
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import LabelCustom from "../../../../components/LabelCustom";
import { Controller, useForm } from "react-hook-form";
import TextFieldCustom from "../../../../components/TextFieldCustom";
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from "../../../../consts/messages";
import apiService from "../../../../services/api-services";
import URL_PATHS from "../../../../services/url-path";
import { useSetToastInformationState } from "../../../../redux/store/ToastMessage";
import { handleErrorMessage } from "../../../../utils/errorMessage";
import { STATUS_TOAST } from "../../../../consts/statusCode";
import ReactSelect from "../../../../components/ReactSelectView";
import { StickyTableCell } from "../../../../components/StickyTableCell";
import clsx from "clsx";
import LoadingTableRow from "../../../../components/LoadingTableRow";
import moment from "moment";
import { FORMAT_DATE, labelDisplayedRows, rowsPerPageOptions } from "../../../../utils";
import NoDataTableRow from "../../../../components/NoDataTableRow";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DISPLAY_TEXTS from "../../../../consts/display-texts";
import DateTimePickerCustom from "../../../../components/DateTimePickerCustom";
import FocusHiddenInput from "../../../../components/FocusHiddenInput";
import { ButtonAddFileMainSelect } from "../../../../components/ButtonAddFile/ButtonAddFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { RegExpEmail, RegPhoneNumber } from "../../../../utils/regExp";
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

const headCells = [
  {
    label: "Tên bác sĩ",
    sort: "doctorId",
    style: { maxWidth: "25%", minWidth: "180px" },
  },
  {
    label: "Hình thức",
    sort: "bookingType",
    style: { maxWidth: "10%", minWidth: "180px" },
  },
  {
    label: "Dịch vụ",
    sort: "service",
    style: { maxWidth: "15%", minWidth: "180px" },
  },
  {
    label: "Ngày khám",
    sort: "date",
    style: { maxWidth: "10%", minWidth: "180px" },
  },
];

const AddUser = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel, getData, dataDetail } = props;
  const { setToastInformation } = useSetToastInformationState();
  const uploadFileService = useUploadFileService();
  const { setLoadingScreen } = useSetLoadingScreenState();

  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);
  const [page, setPage] = useState(0);
  const [dataTable, setDataTable] = useState<any>([]);
  const [loadingTable, setLoadingTable] = useState<any>(false);
  const refProps = useRef<any>(null);

  const listGender = [
    { label: "Nam", value: "Nam" },
    { label: "Nữ", value: "Nữ" },
    { label: "Khác", value: "Khácm" },
  ];

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
      birthday: dataDetail ? dataDetail?.birthday : "",
      gender: dataDetail ? listGender.find((x) => x.value?.toLocaleLowerCase() == dataDetail?.gender?.toLocaleLowerCase()) : "",
      image: dataDetail ? dataDetail?.image : "",
    },
  });

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
    setLoadingScreen(true);
    try {
      let imageUrl;
      if (data?.image && data?.image[0] && data?.image[0]?.file) {
        const uploadImageRes = (await uploadImage(data?.image[0].file as File)) as any;
        imageUrl = uploadImageRes.downloadURL;
      } else {
        imageUrl = isEmpty(data?.image) ? "" : data?.image;
      }
      data.image = imageUrl;
      data.gender = data?.gender?.value;

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

  const getListTable = async (props: any) => {
    setLoadingTable(true);
    const pageSize = !!props && props.hasOwnProperty("pageSize") ? props.pageSize || 0 : rowsPerPage;
    const pageIndex = !!props && props.hasOwnProperty("pageIndex") ? props.pageIndex || 0 : page;

    const params = {
      Page: pageIndex + 1,
      PageSize: pageSize,
    };

    const filters = { equals: { patientId: dataDetail?._id } };
    try {
      const data: any = await apiService.getFilter(URL_PATHS.GET_HISTORY, params, filters);
      setTotalCount(data?.totalUsers);
      setDataTable(data?.data);
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    if (!isEdit) {
      getListTable({});
    }
  }, []);

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
                    maxDateTime: new Date(),
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
