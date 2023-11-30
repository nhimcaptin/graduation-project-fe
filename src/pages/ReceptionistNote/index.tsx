import { Box, Button, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import TextFieldCustom from "../../components/TextFieldCustom";
import LabelCustom from "../../components/LabelCustom";
import Page from "../../components/Page";
import styles from "./styles.module.scss";
import { Controller, useForm } from "react-hook-form";
import FocusHiddenInput from "../../components/FocusHiddenInput";
import SunEditorShare from "../../components/SunEditorStyled";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { stripHTML } from "../../utils";
import ButtonCustom from "../../components/ButtonCustom";
import { useEffect, useMemo, useState } from "react";
import apiService from "../../services/api-services";
import URL_PATHS from "../../services/url-path";
import { useParams } from "react-router-dom";
import { useSetLoadingScreenState } from "../../redux/store/loadingScreen";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";
import { STATUS_TOAST } from "../../consts/statusCode";
import { MESSAGE_ERROR, MESSAGE_ERROR_API, MESSAGE_SUCCESS } from "../../consts/messages";
import moment from "moment";
import clsx from "clsx";
import DateTimePickerCustom from "../../components/DateTimePickerCustom";
import ReactSelect from "../../components/ReactSelectView";
import { isEmpty } from "lodash";
import axios from "axios";
import CrudModal from "../../components/CrudModal";

const ReceptionistNote = () => {
  const [dataUser, setDataUser] = useState<any>({});
  const { setLoadingScreen } = useSetLoadingScreenState();
  const { setToastInformation } = useSetToastInformationState();
  const [isCheck, setIsCheck] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoadingHour, setIsLoadingHour] = useState(false);
  const [hourInDateData, setHourInDateData] = useState([]);
  const [openQR, setOpenQR] = useState<boolean>(false);
  const [imageQR, setImageQR] = useState<any>(null);

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
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      condition: "",
      mainServicerReExamination: "",
      timeTypeId: !dataUser
        ? { _id: dataUser?.bookingId?._id || "", timeSlot: dataUser?.bookingId?.timeSlot || "" }
        : "",
      date: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoadingScreen(true);
    const _item = {
      ...dataUser,
      ...data,
      timeTypeId: data?.timeTypeId?._id,
      isCheck,
    };
    try {
      await apiService.post(URL_PATHS.UPDATE_HISTORY + "/" + params?.id, _item);
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

  const getEditorNewValue = (newValue: string) => {
    const stripedValue = stripHTML(newValue).trim();
    if (stripedValue.length === 1 && stripedValue.charCodeAt(0) === 8203) return "";
    return stripedValue === "" ? "" : newValue;
  };

  const getDetail = async () => {
    setLoadingScreen(true);
    try {
      const { data, isDisabled }: any = await apiService.getFilter(URL_PATHS.DETAIL_HISTORY + "/" + params?.id);
      setIsDisabled(isDisabled);
      const idService = data?.service?.map((x: any) => x?._id);
      setDataUser({
        address: data?.address || data?.patientId?.address,
        email: data?.email || data?.patientId?.email,
        name: data?.name || data?.patientId?.name,
        phone: data?.phone || data?.patientId?.phone,
        gender: data?.gender || data?.patientId?.gender,
        birthday: data?.birthday || data?.patientId?.birthday,
        nameService: data?.service,
        idService: idService,
        idPatient: data?.user?._id,
        idDoctor: data?.doctorId?._id,
        bookingType: data?.bookingType,
        bookingId: data?.bookingId,
      });
      setValue("condition", data?.condition);
      setValue("mainServicerReExamination", data?.bookingId?.service);
      setValue("timeTypeId", {
        _id: data?.bookingId?.timeTypeId?._id || "",
        timeSlot: data?.bookingId?.timeTypeId?.timeSlot || "",
      });
      setValue("date", data?.bookingId?.date);
      setIsCheck(!!data?.bookingId);
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

  const amountMoneyCur = useMemo(() => {
    return (dataUser?.nameService || [])?.reduce((next: any, pre: any) => Number(pre?.price) + next, 0);
  }, [dataUser?.nameService]);

  const amountMoney = useMemo(() => {
    const _item: any = typeof watch("mainServicerReExamination") == "string" ? [] : watch("mainServicerReExamination")
    return (_item || [])?.reduce((next: any, pre: any) => Number(pre?.price) + next, 0);
  }, [watch("mainServicerReExamination")]);

  useEffect(() => {
    getDetail();
    getListTimeType(moment(new Date()).format("YYYY/MM/DD"));
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
      <Grid container item xs={5} sx={{ marginTop: "15px" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isCheck}
              disabled={isDisabled}
              onChange={(e: any, isInputChecked) => {
                setIsCheck(isInputChecked);
                getListTimeType(moment(new Date()).format("YYYY/MM/DD"));
                setValue("date", moment(new Date()).format("YYYY/MM/DD"));
                setValue("timeTypeId", "");
              }}
            />
          }
          label={<LabelCustom title="Đặt lịch tái khám" sx={{ marginBottom: "0px !important" }} />}
        />
      </Grid>

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
                  isDisabled={isDisabled}
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
                    disabled: isDisabled,
                    minDateTime: new Date(),
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
                    const dateHour = item?.timeSlot.split("-")[1];
                    const dateEnd = moment(new Date().getHours() + 1).format("YYYY-MM-DD HH:mm");
                    const date = moment(new Date()).format("YYYY-MM-DD");
                    return (
                      <Button
                        variant={value?._id === item._id ? "contained" : "outlined"}
                        className={clsx({ [styles.active]: value?._id === item._id }, `${styles.btnHour}`, {
                          [styles.isDisabled]:
                            isDisabled ||
                            (item.isDisabled && dataUser?.bookingId?.timeTypeId?._id !== item._id && false),
                        })}
                        onClick={(e: any) => {
                          setValue("timeTypeId", item);
                          clearErrors("timeTypeId");
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
                  disableSunEditor={isDisabled}
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
      <Grid
        container
        item
        xs={8.5}
        sx={{ marginTop: "0px", paddingBottom: "20px", display: "flex", justifyContent: "end" }}
      >
        {isCheck && <ButtonCustom type="submit" title="Đặt lịch tái khám" color="blue" onClick={handleSubmit(onSubmit)} />}
        <ButtonCustom type="submit" title="In hóa đơn" color="yellow" onClick={handleSubmit(onSubmit)} />
        <ButtonCustom type="submit" title="Thanh toán" color="green" onClick={handleSubmit(onSubmitBankTransfer)} />
      </Grid>
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

export default ReceptionistNote;
