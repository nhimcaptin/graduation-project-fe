import React from "react";
import CrudModal from "../../../../components/CrudModal";
import { Grid } from "@mui/material";
import LabelCustom from "../../../../components/LabelCustom";
import { Controller, useForm } from "react-hook-form";
import TextFieldCustom from "../../../../components/TextFieldCustom";
import { MESSAGE_ERROR } from "../../../../consts/messages";
import { BASE_URL } from "../../../../services/base-url";
import URL_PATHS from "../../../../services/url-path";
import { useSetToastInformationState } from "../../../../redux/store/ToastMessage";
import apiService from "../../../../services/api-services";
import { STATUS_TOAST } from "../../../../consts/statusCode";

interface PropsType {
  isOpen: boolean;
  dataDetail: any;
  title: string;
  onCancel: (parameter: any) => void;
  isEdit: boolean;
}

const ChangePassword = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel, dataDetail } = props;

const {setToastInformation} = useSetToastInformationState()



  const onSubmit = async () => {
    const formData = getValues();
    if (title == "Change Password") {
      try {
        await apiService.post(BASE_URL + URL_PATHS.CREATE_USER, formData);
        console.log("Updated User Info:", formData);
        setToastInformation({
          status: STATUS_TOAST.SUCCESS,
          message: "Thêm thành công!!!",
        });
   
        // Đóng popup
        // handleCancel();
      } catch (error) {
        console.error("Error when creating user:", error);
        // Xử lý lỗi nếu cần
      }
    } else if (title == "Edit profile") {
      try {
 
        await apiService.put(
          BASE_URL + URL_PATHS.CREATE_USER + "/" + dataDetail._id,
          formData
        );
        setToastInformation({
          status: STATUS_TOAST.SUCCESS,
          message: "Sửa thành công!!!",
        });
        // Đóng popup
        // handleCancel();
      } catch (error) {
        console.error("Error when editing user:", error);
        // Xử lý lỗi nếu cần
      }
    }
  };
  const {
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: dataDetail?.name,
      email: dataDetail?.email,
      phone: dataDetail?.phone,
      address: dataDetail?.address,
    },
  });

  

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
      <Grid container item xs={12}>
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
          <LabelCustom title="Email" isRequired />
          <Controller
            control={control}
            name="email"
            rules={{
              required: MESSAGE_ERROR.fieldRequired,
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

export default ChangePassword;
