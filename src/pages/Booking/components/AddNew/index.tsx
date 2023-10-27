import React, { useEffect, useState } from "react";
import CrudModal from "../../../../components/CrudModal";
import { Button, Grid, Typography } from "@mui/material";
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
import DateTimePickerCustom from "../../../../components/DateTimePickerCustom";
import moment from "moment";
import clsx from "clsx";
import styles from "./styles.module.scss";
import { useSetLoadingScreenState } from "../../../../redux/store/loadingScreen";

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

  const { setLoadingScreen } = useSetLoadingScreenState();
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  const [isLoadingHour, setIsLoadingHour] = useState(false);
  const [hourInDateData, setHourInDateData] = useState([]);

  const dataType = [
    {
      value: "Online",
      label: "Online",
    },
    {
      value: "Offline",
      label: "Tại quầy",
    },
  ];

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: dataDetail ? dataDetail?.booking?.description : "",
      patient: dataDetail ? { value: dataDetail?.booking?.patientId, label: dataDetail?.patient?.name } : "",
      doctor: dataDetail ? { value: dataDetail?.booking?.doctorId, label: dataDetail?.doctor?.name } : "",
      bookingType: dataDetail ? dataType.find((x) => x.value === dataDetail?.booking?.bookingType) : null,
      date: dataDetail ? dataDetail?.booking?.date : new Date(),
      timeTypeId: dataDetail ? { _id: dataDetail?.booking?.timeTypeId, timeSlot: dataDetail?.timeType?.name } : "",
      mainService: dataDetail ? { value: dataDetail?.booking?.service, label: dataDetail?.service?.name } : "",
    },
  });

  const onSubmit = async (data: any) => {
    const item = {
      patientId: data?.patient._id,
      doctorId: data?.doctor._id,
      date: data?.bookingType.value === "Online" ? moment(data?.date).format("YYYY/MM/DD") : undefined,
      timeTypeId: data?.timeTypeId._id,
      description: data?.description,
      service: data?.mainService._id,
      bookingType: data?.bookingType.value,
      status: data?.bookingType.value === "Offline" ? "Approved" : "Waiting",
      statusUpdateTime:
        data?.bookingType.value === "Online" ? moment(new Date()).format("YYYY/MM/DD HH:mm") : undefined,
    };
    setLoadingScreen(true);
    try {
      await apiService.post(URL_PATHS.CREATE_BOOKING, item);
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: MESSAGE_SUCCESS.CREATE_BOOKING,
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

  const getPatientOptions = async (searchText: string, page: number, perPage: number) => {
    setIsLoadingPatient(true);
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
      setIsLoadingPatient(false);
    }
  };

  const getDoctorOptions = async (searchText: string, page: number, perPage: number) => {
    const params = {
      page,
      perPage,
    };

    const filters = {
      name: searchText,
    };
    try {
      const res: any = await await apiService.getFilter(URL_PATHS.GET_DOCTOR, params, filters);
      const resultItems: any[] = res?.doctors;
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

  const getMainServiceOptions = async (searchText: string, page: number, perPage: number) => {
    const params = {
      page,
      perPage,
    };

    const filters = {
      name: searchText,
    };
    try {
      const res: any = await await apiService.getFilter(URL_PATHS.GET_LIST_MAIN_SERVICE, params, filters);
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
    getListTimeType(moment(new Date()).format("YYYY/MM/DD"));
  }, []);

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
            <LabelCustom title="Hình thức" isRequired />
            <Controller
              control={control}
              name="bookingType"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <ReactSelect
                  isClearable
                  options={dataType}
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.value}
                  value={value}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  fieldName={name}
                  maxMenuHeight={200}
                  placeholder="Chọn hình thức"
                  inputRef={ref}
                  isValidationFailed
                  isDisabled={!isEdit}
                  isLoading={isLoadingPatient}
                  errorMessage={errors?.bookingType?.message as string}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={5}>
            <LabelCustom title="Dịch vụ" isRequired />
            <Controller
              control={control}
              name="mainService"
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
                  maxMenuHeight={200}
                  placeholder="Chọn hình thức"
                  inputRef={ref}
                  isValidationFailed
                  isDisabled={!isEdit}
                  isLoading={isLoadingPatient}
                  errorMessage={errors?.bookingType?.message as string}
                />
              )}
            />
          </Grid>
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
                  placeholder="Chọn bệnh nhân"
                  inputRef={ref}
                  isValidationFailed
                  isDisabled={!isEdit}
                  isLoading={isLoadingPatient}
                  errorMessage={errors?.patient?.message as string}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={5}>
            <LabelCustom title="Bác sĩ" isRequired />
            <Controller
              control={control}
              name="doctor"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, onBlur, value, ref, name } }) => (
                <ReactSelect
                  isClearable
                  getOptions={getDoctorOptions}
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.value}
                  value={value}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                  fieldName={name}
                  maxMenuHeight={200}
                  placeholder="Chọn bác sĩ"
                  inputRef={ref}
                  isValidationFailed
                  isDisabled={!isEdit}
                  isLoading={isLoadingPatient}
                  errorMessage={errors?.doctor?.message as string}
                />
              )}
            />
          </Grid>
        </Grid>
        {watch("bookingType")?.value === "Online" && (
          <Grid container item xs={12} sx={{ marginTop: "15px" }}>
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
                      disabled: !isEdit,
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
        {watch("bookingType")?.value === "Online" && (
          <Grid container item xs={12} sx={{ marginTop: "10px", position: "relative" }}>
            <Controller
              key={watch("bookingType")?.value}
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
                          disabled={!isEdit}
                          variant={value?._id === item._id ? "contained" : "outlined"}
                          className={clsx({ [styles.active]: value?._id === item._id }, `${styles.btnHour}`, {
                            // [styles.isDisabled]:
                            //   moment(`${date} ${dateHour}`).isAfter(`${dateEnd}`) || item.isDisabled || !isEdit,
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
      </Grid>
    </CrudModal>
  );
};

export default AddUser;
