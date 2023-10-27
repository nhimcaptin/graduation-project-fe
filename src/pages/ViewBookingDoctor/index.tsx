import { Box, Grid } from "@mui/material";
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
import { MESSAGE_SUCCESS } from "../../consts/messages";

const ViewBookingDoctor = () => {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      condition: "",
    },
  });

  const [dataUser, setDataUser] = useState<any>({
    address: "",
    email: "",
    name: "",
    phone: "",
    nameService: "",
  });
  const { setLoadingScreen } = useSetLoadingScreenState();
  const { setToastInformation } = useSetToastInformationState();
  const params = useParams();

  const onSubmit = async (data: any) => {
    setLoadingScreen(true);
    const _item = {
      ...dataUser,
      ...data,
      id: params?.id,
    };
    try {
      const data: any = await apiService.post(URL_PATHS.CREATE_HISTORY, _item);
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: MESSAGE_SUCCESS.UPDATE_STATUS,
      });
    } catch (error) {
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
      const data: any = await apiService.getFilter(URL_PATHS.GET_DETAIL_COME_CHECK + "/" + params?.id);
      setDataUser({
        address: data?.user?.address,
        email: data?.user?.email,
        name: data?.user?.name,
        phone: data?.user?.phone,
        nameService: data?.service?.name,
        idService: data?.service?._id,
        idPatient: data?.user?._id,
        idDoctor: data?.doctorId,
        bookingType: data?.bookingType,
      });
    } catch (error) {
    } finally {
      setLoadingScreen(false);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);
  return (
    <Page className={styles.root} title="Thông tin bệnh nhân" isActive>
      <Grid container item xs={5} sx={{ marginTop: "15px" }}>
        <Grid item xs={5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Họ và tên" />
            <TextFieldCustom value={dataUser?.name} disabled placeholder="Nhập số điện thoại" type="text" />
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
            <TextFieldCustom value={dataUser?.email} disabled placeholder="Nhập số điện thoại" type="text" />
          </Box>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Địa chỉ" />
            <TextFieldCustom value={dataUser?.address} disabled placeholder="Nhập số điện thoại" type="text" />
          </Box>
        </Grid>
      </Grid>
      <Grid container item xs={5} sx={{ marginTop: "15px" }}>
        <Grid item xs={5}>
          <Box style={{ marginTop: 2 }}>
            <LabelCustom title="Dịch vụ" />
            <TextFieldCustom value={dataUser?.nameService} disabled placeholder="Nhập số điện thoại" type="text" />
          </Box>
        </Grid>
      </Grid>
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
          {errors?.condition && (
            <ErrorMessage style={{ marginTop: "-10px" }}>{errors?.condition?.message}</ErrorMessage>
          )}
        </Grid>
      </Grid>
      <Grid container item xs={6} sx={{ marginTop: "0px", display: "flex", justifyContent: "end" }}>
        <ButtonCustom type="submit" title="Lưu" color="yellow" onClick={handleSubmit(onSubmit)} />
      </Grid>
    </Page>
  );
};

export default ViewBookingDoctor;
