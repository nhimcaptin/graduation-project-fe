import React, { useEffect, useState } from "react";
import CrudModal from "../../../components/CrudModal";
import { Autocomplete, Grid, styled, Typography } from "@mui/material";
import LabelCustom from "../../../components/LabelCustom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import TextFieldCustom from "../../../components/TextFieldCustom";
import { MESSAGE_ERROR, MESSAGE_SUCCESS } from "../../../consts/messages";
import SelectBox from "../../../components/CheckBoxCustom";
import COLORS from "../../../consts/colors";
import { useSetToastInformationState } from "../../../redux/store/ToastMessage";
import { handleErrorMessage } from "../../../utils/errorMessage";
import { STATUS_TOAST } from "../../../consts/statusCode";
import apiService from "../../../services/api-services";
import URL_PATHS from "../../../services/url-path";
import { useSetLoadingScreenState } from "../../../redux/store/loadingScreen";

const TextRolePosition = styled(Typography)({
  fontWeight: 500,
  fontSize: "14px",
  color: "#614C4C",
});

const PositionSelectBox = styled(SelectBox)({
  alignItems: "flex-start",
  "& .MuiTypography-root": {
    marginTop: "8px",
    display: "inline-block",
    lineHeight: "20px !important",
  },
});

interface IFormPermission {
  actionCode: string;
  resourceCode: string;
  isActive: boolean;
  idResource: number | string;
  idAction: number | string;
}

type IFormData = {
  roleName: string;
  description: string;
  permissions: IFormPermission[];
};

const defaultFormData: IFormData = {
  roleName: "",
  description: "",
  permissions: [],
};

const AddEditRole = (props: any) => {
  const { title, isOpen, isEdit, handleClose, isLoading, permissionList, roleDetail, getListRole } = props;
  const [permissonFieldMap, setPermissonFieldMap] = useState<{ [key: string]: number }>({});

  const { setToastInformation } = useSetToastInformationState();
  const { setLoadingScreen } = useSetLoadingScreenState();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: defaultFormData });

  const { fields, append } = useFieldArray({
    control,
    name: "permissions",
  });

  const handleTrimTextInput = (e: any) => {
    const newText = e.target.value || "";
    return { target: { value: newText.trim() } };
  };

  const isActionActive = (action: string, resource: string) => {
    const isActive = !!(roleDetail?.permissions || []).find(
      (role: any) => role.actionCode === action && role.resourceCode === resource
    );

    return isActive;
  };

  const populatePermission = () => {
    let currentIndex = 0;
    let permissonFieldMap: { [key: string]: number } = {};
    permissionList.map((permission: any) => {
      const resourceCode = permission.resource.code;
      const resourceid = permission.resource._id;
      permission.actions.map((action: any) => {
        append({
          actionCode: action.code,
          resourceCode,
          isActive: roleDetail ? isActionActive(action.code, resourceCode) : false,
          idResource: resourceid,
          idAction: action._id,
        });
        permissonFieldMap[`${resourceCode}.${action.code}`] = currentIndex;
        currentIndex++;
      });
    });
    setPermissonFieldMap(permissonFieldMap);
  };

  const onSubmit = async (data: IFormData) => {
    setLoadingScreen(true);
    const isActivePermiss = data.permissions.filter((x: any) => x.isActive);

    const obj: any = {};
    isActivePermiss?.forEach((x: any) => {
      if (obj[x.idResource]) {
        obj[x.idResource].push({ _id: x.idAction });
      } else {
        obj[x.idResource] = [{ _id: x.idAction }];
      }
    });

    const permissions = Object.keys(obj)?.map((x: any) => {
      return {
        resource: { _id: x },
        actions: obj[x],
      };
    });
    const dataSubmit = {
      roleName: data.roleName,
      description: data.description,
      permissions,
    };

    try {
      await apiService.put(`${URL_PATHS.ROLE_EDIT}?id=${roleDetail?.id}`, dataSubmit);
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: MESSAGE_SUCCESS.UPDATE_ROLE,
      });
      handleClose();
      getListRole();
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setLoadingScreen(false);
    }
  };

  useEffect(() => {
    setValue("description", roleDetail.description);
    setValue("roleName", roleDetail.roleName);
    populatePermission();
  }, []);
  return (
    <>
      <CrudModal
        formTitle={title}
        isOpen={isOpen}
        saveBtnLabel="Lưu"
        handleSave={!isEdit ? undefined : handleSubmit(onSubmit)}
        cancelBtnLabel={!isEdit ? "Đóng" : "Hủy"}
        handleClose={handleClose}
        dialogProps={{ maxWidth: "md", fullWidth: true }}
        isDisable={isLoading}
      >
        <Grid container spacing={2} sx={{ paddingLeft: "10px" }}>
          <Grid item xs={3} sx={{ display: "flex", alignItem: "center" }}>
            <LabelCustom title="Tên vai trò" sx={{ display: "flex", alignItems: "center" }} isRequired />
          </Grid>
          <Grid item xs={7}>
            <Controller
              control={control}
              name="roleName"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, value, name } }) => {
                return (
                  <TextFieldCustom
                    value={value}
                    name={name}
                    onChange={onChange}
                    onBlur={(e) => {
                      onChange(handleTrimTextInput(e));
                    }}
                    placeholder="Nhập tên vai trò"
                    errorMessage={errors?.roleName?.message}
                    disabled={true}
                  />
                );
              }}
            />
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              fontWeight: 700,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              color: "#614C4C",
            }}
          >
            <LabelCustom title="Mô tả" sx={{ display: "flex", alignItems: "center" }} />
          </Grid>
          <Grid item xs={7}>
            <Controller
              control={control}
              name="description"
              rules={{
                required: MESSAGE_ERROR.fieldRequired,
              }}
              render={({ field: { onChange, value, name } }) => {
                return (
                  <TextFieldCustom
                    value={value}
                    name={name}
                    onChange={onChange}
                    onBlur={(e) => {
                      onChange(handleTrimTextInput(e));
                    }}
                    placeholder="Nhập mô tả"
                    multiline
                    errorMessage={errors?.description?.message}
                    disabled={!isEdit}
                  />
                );
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 700, fontSize: "16px", color: "#614C4C" }}>Chọn quyền cho vai trò</Typography>
          </Grid>
          {permissionList &&
            permissionList.map((resource: any, _index: number) => (
              <Grid container item xs={12} key={resource.resource.code}>
                <Grid item xs={3}>
                  <TextRolePosition>{resource.resource.name}</TextRolePosition>
                </Grid>
                <Grid container item xs={9} key={_index}>
                  {resource.actions &&
                    resource.actions.map((action: any, index: number) => (
                      <Grid item xs={2} key={index}>
                        <Controller
                          control={control}
                          key={`${watch(
                            `permissions.${permissonFieldMap[`${resource.resource.code}.${action.code}`]}.isActive`
                          )}`}
                          name={`permissions.${permissonFieldMap[`${resource.resource.code}.${action.code}`]}.isActive`}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <PositionSelectBox
                                value={value ? value : false}
                                onChange={onChange}
                                label={action.name}
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    fontSize: "16px",
                                    color: COLORS.TEXT,
                                  },
                                }}
                                sxLabel={{ fontSize: "12px", color: COLORS.TEXT }}
                                disabled={!isEdit}
                              />
                            );
                          }}
                        />
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            ))}
        </Grid>
      </CrudModal>
    </>
  );
};

export default AddEditRole;
