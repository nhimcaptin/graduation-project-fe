import { Box, Button, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import clsx from "clsx";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import ButtonCustom from "../../components/ButtonCustom";
import DateTimePickerCustom from "../../components/DateTimePickerCustom";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import FocusHiddenInput from "../../components/FocusHiddenInput";
import LabelCustom from "../../components/LabelCustom";
import Page from "../../components/Page";
import SunEditorShare from "../../components/SunEditorStyled";
import TextFieldCustom from "../../components/TextFieldCustom";
import { MESSAGE_ERROR, MESSAGE_ERROR_API, MESSAGE_SUCCESS } from "../../consts/messages";
import { STATUS_TOAST } from "../../consts/statusCode";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";
import { useSetLoadingScreenState } from "../../redux/store/loadingScreen";
import apiService from "../../services/api-services";
import URL_PATHS from "../../services/url-path";
import { stripHTML } from "../../utils";
import styles from "./styles.module.scss";
import ReactSelect from "../../components/ReactSelectView";
import axios from "axios";
import CrudModal from "../../components/CrudModal";
import { isEmpty } from "lodash";

const ViewBookingDoctor = () => {
  const [dataUser, setDataUser] = useState<any>({
    address: "",
    email: "",
    name: "",
    phone: "",
    nameService: "",
  });
  const [isIdHistory, setIsIdHistory] = useState<any>("");
  const [isIdBooking, setIsIdBookingy] = useState<any>("");
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isCheck, setIsCheck] = useState(false);
  const [isLoadingHour, setIsLoadingHour] = useState(false);
  const [hourInDateData, setHourInDateData] = useState([]);
  const [openQR, setOpenQR] = useState<boolean>(false);
  const [imageQR, setImageQR] = useState<any>(null);
  const [isPushCount, setIsPushCount] = useState<boolean>(false);

  const { setLoadingScreen } = useSetLoadingScreenState();
  const { setToastInformation } = useSetToastInformationState();
  const params = useParams();

  const moenyService = useMemo(() => {
    if (isEmpty(dataUser?.nameService)) {
      return 0;
    }
    return dataUser?.nameService.reduce(
      (accumulator: any, currentValue: any) => accumulator + (currentValue?.price ? Number(currentValue?.price) : 0),
      0
    );
  }, [dataUser?.nameService]);

  const {
    handleSubmit,
    control,
    watch,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      condition: "",
      date: "",
      timeTypeId: "",
      mainServicerReExamination: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoadingScreen(true);
    const _item = {
      ...dataUser,
      condition: data?.condition,
      id: params?.id,
    };
    try {
      const data: any = await apiService.post(URL_PATHS.CREATE_HISTORY, _item);
      setIsIdHistory(data?._id);
      setIsDone(true);
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: MESSAGE_SUCCESS.UPDATE_STATUS,
      });
    } catch (error) {
    } finally {
      setLoadingScreen(false);
    }
  };

  const onSubmitReExamination = async (data: any) => {
    setLoadingScreen(true);
    const mainServicerReExamination = data.mainServicerReExamination.map((x: any) => x?._id);
    const _item = {
      ...dataUser,
      ...data,
      timeTypeId: data?.timeTypeId?._id,
      mainServicerReExamination,
      isCheck,
      bookingId: isIdBooking,
    };
    try {
      const res: any = await apiService.post(URL_PATHS.UPDATE_HISTORY + "/" + isIdHistory, _item);
      setIsIdBookingy(res?.bookingId);
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: MESSAGE_SUCCESS.UPDATE_STATUS,
      });
    } catch (error) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: MESSAGE_ERROR_API.ERROR_SYSTEM,
      });
    } finally {
      setLoadingScreen(false);
    }
  };

  const onSubmitBankTransfer = async () => {
    const data = {
      accountNo: "1014543955",
      accountName: "TRAN DANH DOANH",
      acqId: 970415,
      amount: moenyService,
      addInfo: `DTTD_${params?.id}_DTTD`,
      format: "text",
      template: "print",
    };
    return await axios
      .post("https://api.vietqr.io/v2/generate", data)
      .then(function (res: any) {
        if (res?.data?.code === "00") {
          setImageQR(res?.data?.data?.qrDataURL);
          setOpenQR(true);
          return true;
        } else {
          return setToastInformation({
            status: STATUS_TOAST.ERROR,
            message: MESSAGE_ERROR_API.QRBankTransfer,
          });
        }
      })
      .catch(function (error) {
        return setToastInformation({
          status: STATUS_TOAST.ERROR,
          message: MESSAGE_ERROR_API.ERROR_SYSTEM,
        });
      });
  };

  const getEditorNewValue = (newValue: string) => {
    const stripedValue = stripHTML(newValue).trim();
    if (stripedValue.length === 1 && stripedValue.charCodeAt(0) === 8203) return "";
    return stripedValue === "" ? "" : newValue;
  };

  const getDetail = async () => {
    setLoadingScreen(true);
    try {
      const data: any = await apiService.getFilter(URL_PATHS.GET_DETAIL_COME_CHECK + "/" + params?.id);
      const idService = data?.service?.map((x: any) => x?._id);
      setDataUser({
        address: data?.addressCustomer || data?.patientId?.address,
        email: data?.emailCustomer || data?.patientId?.email,
        name: data?.nameCustomer || data?.patientId?.name,
        phone: data?.numberPhoneCustomer || data?.patientId?.phone,
        gender: data?.genderCustomer || data?.patientId?.gender,
        birthday: data?.birthdayCustomer || data?.patientId?.birthday,
        nameService: data?.service,
        idService: idService,
        idPatient: data?.user?._id,
        idDoctor: data?.doctorId?._id,
        bookingType: data?.bookingType,
      });
      setIsDone(data?.status == "Done");
    } catch (error) {
    } finally {
      setLoadingScreen(false);
    }
  };

  const getListTimeType = async (date: any) => {
    setIsLoadingHour(true);
    try {
      const params = {
        equals: {
          date,
        },
      };
      const res: any = await apiService.getFilter(URL_PATHS.GET_LIST_TIME_TYPE, null, params);
      setHourInDateData(res);
    } catch (error) {
    } finally {
      setIsLoadingHour(false);
    }
  };

  const getMainServiceOptions = async (searchText: string, page: number, perPage: number) => {
    const params = {
      page,
      perPage,
    };

    const filters = {
      name: searchText,
    };
    try {
      const res: any = await await apiService.getFilter(URL_PATHS.GET_LIST_SUB_SERVICE, params, filters);
      const resultItems: any[] = res?.getSubservice;
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

  const amountMoneyCur = useMemo(() => {
    return (dataUser?.nameService || [])?.reduce((next: any, pre: any) => Number(pre?.price) + next, 0);
  }, [dataUser?.nameService]);

  const amountMoney = useMemo(() => {
    const _item: any = typeof watch("mainServicerReExamination") == "string" ? [] : watch("mainServicerReExamination");
    return (_item || [])?.reduce((next: any, pre: any) => Number(pre?.price) + next, 0);
  }, [watch("mainServicerReExamination")]);

  useEffect(() => {
    getDetail();
    getListTimeType(moment().add(1,'d').format("YYYY/MM/DD"));
  }, []);
  return (
    <Page className={styles.root} title="Thông tin bệnh nhân" isActive>
      <Grid container item xs={12} sx={{ marginTop: "15px" }}>
        <Grid item xs={2.5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Họ và tên" />
            <TextFieldCustom value={dataUser?.name} disabled placeholder="Nhập họ và tên" type="text" />
          </Box>
        </Grid>
        <Grid item xs={0.5}></Grid>
        <Grid item xs={2.5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Số điện thoại" />
            <TextFieldCustom value={dataUser?.phone} disabled placeholder="Nhập số điện thoại" type="text" />
          </Box>
        </Grid>
        <Grid item xs={0.5}></Grid>
        <Grid item xs={2.5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Email" />
            <TextFieldCustom value={dataUser?.email} disabled placeholder="Nhập email" type="text" />
          </Box>
        </Grid>
      </Grid>

      <Grid container item xs={12} sx={{ marginTop: "15px" }}>
        <Grid item xs={2.5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Ngày sinh" />
            <TextFieldCustom
              value={dataUser?.birthday ? moment(dataUser?.birthday).format("DD/MM/YYYY") : ""}
              disabled
              placeholder="Nhập ngày sinh"
              type="text"
            />
          </Box>
        </Grid>
        <Grid item xs={0.5}></Grid>
        <Grid item xs={2.5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Giới tính" />
            <TextFieldCustom value={dataUser?.gender} disabled placeholder="Nhập giới tính" type="text" />
          </Box>
        </Grid>
        <Grid item xs={0.5}></Grid>
        <Grid item xs={2.5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Địa chỉ" />
            <TextFieldCustom value={dataUser?.address} disabled placeholder="Nhập địa" type="text" />
          </Box>
        </Grid>
      </Grid>

      <Grid container item xs={12} sx={{ marginTop: "15px" }}>
        <Grid item xs={2.5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Dịch vụ" />
            <ReactSelect
              isClearable
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option._id}
              value={dataUser?.nameService}
              isMulti
              isDisabled
              fieldName="name"
              maxMenuHeight={200}
              placeholder="Chọn dịch vụ"
              menuPlacement="top"
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container item xs={12} sx={{ marginTop: "15px" }}>
        <LabelCustom
          title={`Tổng đơn: ${amountMoneyCur?.toLocaleString("en")} VND`}
          sx={{ color: "#bf1e2e !important" }}
        />
      </Grid>

      {isDone && (
        <Grid container item xs={5} sx={{ marginTop: "15px" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheck}
                onChange={(e: any, isInputChecked) => {
                  setIsCheck(isInputChecked);
                  getListTimeType(moment().add(1,'d').format("YYYY/MM/DD"));
                  setValue("date", moment().add(1,'d').format("YYYY/MM/DD"));
                  setValue("timeTypeId", "");
                }}
              />
            }
            label={<LabelCustom title="Đặt lịch tái khám" sx={{ marginBottom: "0px !important" }} />}
          />
        </Grid>
      )}

      {isCheck && (
        <Grid container item xs={12} sx={{ marginTop: "5px" }}>
          <Grid item xs={2.5}>
            <LabelCustom title="Dịch vụ tái khám" />
            <Controller
              control={control}
              name="mainServicerReExamination"
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <ReactSelect
                  isClearable
                  getOptions={getMainServiceOptions}
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option._id}
                  value={value}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  isMulti
                  fieldName={name}
                  maxMenuHeight={200}
                  placeholder="Chọn dịch vụ tái khám"
                  inputRef={ref}
                  errorMessage={errors?.mainServicerReExamination?.message as string}
                  menuPlacement="top"
                />
              )}
            />
            {!!amountMoney && <p className={styles.amountMoney}>Tương ứng: {amountMoney.toLocaleString("en")} VND</p>}
          </Grid>
        </Grid>
      )}

      {isCheck && (
        <Grid container item xs={12} sx={{ marginTop: "15px" }}>
          <Grid item xs={2.5}>
            <LabelCustom title="Ngày đặt lịch" isRequired />
            <Controller
              control={control}
              name="date"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { value, onChange } }) => (
                <DateTimePickerCustom
                  inputProps={{
                    errorMessage: errors?.date?.message,
                  }}
                  staticDateTimePickerProps={{
                    minDateTime: moment().add(1,'d').format(),
                    views: ["year", "day"],
                    ampm: true,
                  }}
                  value={value}
                  onChange={(e: any) => {
                    onChange(e);
                    getListTimeType(moment(e).format("YYYY/MM/DD"));
                    setValue("timeTypeId", "");
                    clearErrors("timeTypeId");
                  }}
                  inputFormat="DD/MM/YYYY"
                />
              )}
            />
          </Grid>
        </Grid>
      )}

      {isCheck && (
        <Grid container item xs={5} sx={{ marginTop: "10px", position: "relative" }}>
          <Controller
            shouldUnregister
            control={control}
            name="timeTypeId"
            rules={{
              required: MESSAGE_ERROR.fieldRequired,
            }}
            render={({ field: { value, onChange } }: any) => {
              return (
                <>
                  {hourInDateData.map((item: any, index: number) => {
                    return (
                      <Button
                        variant={value?._id === item._id ? "contained" : "outlined"}
                        className={clsx({ [styles.active]: value?._id === item._id }, `${styles.btnHour}`, {
                          [styles.isDisabled]: item?.count === 3 && dataUser?.bookingId?.timeTypeId?._id !== item._id,
                        })}
                        onClick={(e: any) => {
                          setValue("timeTypeId", item);
                          clearErrors("timeTypeId");
                          setIsPushCount(dataUser?.bookingId?.timeTypeId?._id !== item._id);
                        }}
                      >
                        <Typography
                          className={clsx({ [styles.titleActive]: value?._id === item._id }, `${styles.title}`)}
                        >
                          {item.timeSlot}
                        </Typography>
                      </Button>
                    );
                  })}
                </>
              );
            }}
          />
          {errors?.timeTypeId && (
            <ErrorMessage style={{ marginTop: "10px" }}>{errors?.timeTypeId?.message}</ErrorMessage>
          )}
          {isLoadingHour && (
            <div className={styles.loadingHour}>
              <div className={styles.loader}></div>
            </div>
          )}
          {watch("timeTypeId") && (
            <p style={{ margin: "4px 0px 0px 2px", color: "#1A6332", fontSize: "14px", fontWeight: "700" }}>
              Số thứ tự của bạn trong khung giờ khám từ {(watch("timeTypeId") as any)?.timeSlot} là{" "}
              {isPushCount
                ? Number((watch("timeTypeId") as any)?.count || 0) + 1
                : Number((watch("timeTypeId") as any)?.count || 0)}
            </p>
          )}
        </Grid>
      )}

      <Grid container item xs={12} sx={{ marginTop: "15px" }}>
        <Grid item xs={8.5} mt={1}>
          <LabelCustom title="Tình trạng" />
          <Controller
            control={control}
            name="condition"
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <>
                <FocusHiddenInput ref={ref}></FocusHiddenInput>
                <SunEditorShare
                  hideToolbarSunEditor={false}
                  disableSunEditor={false}
                  onChangeEditorState={(newValue: any) => onChange(getEditorNewValue(newValue))}
                  setContents={value || ""}
                  minHeight="400px"
                  errorEditor={!!errors?.condition?.message}
                  onBlur={(e: any, content: any) => {
                    onBlur();
                    onChange((content || "").trim());
                  }}
                />
              </>
            )}
          />
        </Grid>
      </Grid>
      {!isDone ? (
        <Grid
          container
          item
          xs={8.5}
          sx={{ marginTop: "0px", paddingBottom: "20px", display: "flex", justifyContent: "end" }}
        >
          <ButtonCustom type="submit" title="Khám xong" color="yellow" onClick={handleSubmit(onSubmit)} />
        </Grid>
      ) : (
        <Grid
          container
          item
          xs={8.5}
          sx={{ marginTop: "0px", paddingBottom: "20px", display: "flex", justifyContent: "end" }}
        >
          {isCheck && (
            <ButtonCustom
              type="submit"
              title="Đặt lịch tái khám"
              color="blue"
              onClick={handleSubmit(onSubmitReExamination)}
            />
          )}
          <ButtonCustom type="submit" title="In hóa đơn" color="yellow" onClick={handleSubmit(onSubmit)} />
          <ButtonCustom type="submit" title="Mã QR" color="green" onClick={handleSubmit(onSubmitBankTransfer)} />
        </Grid>
      )}
      <CrudModal
        isOpen={openQR}
        formTitle="Mã QR"
        handleClose={() => {
          setOpenQR(false);
        }}
        saveBtnLabel="Thanh toán"
        cancelBtnLabel="Thoát"
        dialogProps={{
          fullWidth: true,
          maxWidth: "sm",
          sx: { zIndex: 9999 },
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={imageQR} alt="" style={{ width: "560px" }} />
        </div>
      </CrudModal>
    </Page>
  );
};

export default ViewBookingDoctor;
