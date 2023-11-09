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
import { useEffect, useState } from "react";
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

const ReceptionistNote = () => {
  const [dataUser, setDataUser] = useState<any>({});
  const { setLoadingScreen } = useSetLoadingScreenState();
  const { setToastInformation } = useSetToastInformationState();
  const [isCheck, setIsCheck] = useState(false);
  const [isLoadingHour, setIsLoadingHour] = useState(false);
  const [hourInDateData, setHourInDateData] = useState([]);

  const params = useParams();

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      condition: "",
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
      const { data }: any = await apiService.getFilter(URL_PATHS.DETAIL_HISTORY + "/" + params?.id);
      setDataUser({
        address: data?.address || data?.patientId?.address,
        email: data?.email || data?.patientId?.email,
        name: data?.name || data?.patientId?.name,
        phone: data?.phone || data?.patientId?.phone,
        gender: data?.gender || data?.patientId?.gender,
        birthday: data?.birthday || data?.patientId?.birthday,
        nameService: data?.service?.name,
        idService: data?.service?._id,
        idPatient: data?.user?._id,
        idDoctor: data?.doctorId?._id,
        bookingType: data?.bookingType,
        bookingId: data?.bookingId,
      });
      setValue("condition", data?.condition);
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

  useEffect(() => {
    getDetail();
    getListTimeType(moment(new Date()).format("YYYY/MM/DD"));
  }, []);
  return (
    <Page className={styles.root} title="Thông tin bệnh nhân" isActive>
      <Grid container item xs={5} sx={{ marginTop: "15px" }}>
        <Grid item xs={5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Họ và tên" />
            <TextFieldCustom value={dataUser?.name} disabled placeholder="Nhập họ và tên" type="text" />
          </Box>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Số điện thoại" />
            <TextFieldCustom value={dataUser?.phone} disabled placeholder="Nhập số điện thoại" type="text" />
          </Box>
        </Grid>
      </Grid>

      <Grid container item xs={5} sx={{ marginTop: "15px" }}>
        <Grid item xs={5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Email" />
            <TextFieldCustom value={dataUser?.email} disabled placeholder="Nhập email" type="text" />
          </Box>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={5}>
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
      </Grid>
      <Grid container item xs={5} sx={{ marginTop: "15px" }}>
        <Grid item xs={5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Giới tính" />
            <TextFieldCustom value={dataUser?.gender} disabled placeholder="Nhập giới tính" type="text" />
          </Box>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Địa chỉ" />
            <TextFieldCustom value={dataUser?.address} disabled placeholder="Nhập địa" type="text" />
          </Box>
        </Grid>
      </Grid>

      <Grid container item xs={5} sx={{ marginTop: "15px" }}>
        <Grid item xs={5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Dịch vụ" />
            <TextFieldCustom value={dataUser?.nameService} disabled placeholder="Nhập dịch vụ" type="text" />
          </Box>
        </Grid>
      </Grid>
      <Grid container item xs={5} sx={{ marginTop: "15px" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isCheck}
              onChange={(e: any, isInputChecked) => {
                setIsCheck(isInputChecked);
                getListTimeType(moment(new Date()).format("YYYY/MM/DD"));
              }}
            />
          }
          label={<LabelCustom title="Đặt lịch tái khám" sx={{ marginBottom: "0px !important" }} />}
        />
      </Grid>

      {isCheck && (
        <Grid container item xs={5} sx={{ marginTop: "5px" }}>
          <Grid item xs={5}>
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
                    minDateTime: new Date(),
                    views: ["year", "day"],
                    ampm: true,
                  }}
                  value={value}
                  onChange={(e: any) => {
                    onChange(e);
                    getListTimeType(moment(e).format("YYYY/MM/DD"));
                    setValue("timeTypeId", "");
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
                          [styles.isDisabled]: item.isDisabled && dataUser?.bookingId?.timeTypeId?._id !== item._id,
                        })}
                        onClick={(e: any) => {
                          setValue("timeTypeId", item);
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
          {isLoadingHour && (
            <div className={styles.loadingHour}>
              <div className={styles.loader}></div>
            </div>
          )}
        </Grid>
      )}

      <Grid container item xs={6} sx={{ marginTop: "15px" }}>
        <Grid item xs={12} mt={1}>
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
      <Grid
        container
        item
        xs={6}
        sx={{ marginTop: "0px", paddingBottom: "20px", display: "flex", justifyContent: "end" }}
      >
        <ButtonCustom type="submit" title="Lưu" color="yellow" onClick={handleSubmit(onSubmit)} />
      </Grid>
    </Page>
  );
};

export default ReceptionistNote;
