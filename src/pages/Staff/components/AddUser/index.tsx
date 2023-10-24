import React, { useState } from "react";
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

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: dataDetail ? dataDetail?.name : "",
      email: dataDetail ? dataDetail?.email : "",
      phone: dataDetail ? dataDetail?.phone : "",
      address: dataDetail ? dataDetail?.address : "",
      role: dataDetail ? dataDetail?.role : "",
    },
  });

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
        console.log("items", items);
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

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (!!dataDetail) {
        await apiService.put(`${URL_PATHS.CREATE_USER}/${dataDetail?._id}`, data);
        setToastInformation({
          status: STATUS_TOAST.SUCCESS,
          message: MESSAGE_SUCCESS.EDIT_STAFF,
        });
      } else {
        await apiService.post(URL_PATHS.CREATE_USER, data);
        setToastInformation({
          status: STATUS_TOAST.SUCCESS,
          message: MESSAGE_SUCCESS.CREATE_STAFF,
        });
      }
      onCancel && onCancel();
      getData && getData({});
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
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
        <Grid container item xs={12} sx={{ marginTop: "15px" }}>
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
