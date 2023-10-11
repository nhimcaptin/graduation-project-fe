import React from "react";
import CrudModal from "src/components/CrudModal";
import { Autocomplete, Grid, styled, Typography } from "@mui/material";
import LabelCustom from "src/components/LabelCustom";
import { Controller, useForm } from "react-hook-form";
import TextFieldCustom from "src/components/TextFieldCustom";
import { MESSAGE_ERROR } from "src/consts/messages";

const AddEditRole = (props: any) => {
  const { title, isOpen, isEdit, handleCancelForm, isLoading } = props;

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const handleTrimTextInput = (e: any) => {
    const newText = e.target.value || "";
    return { target: { value: newText.trim() } };
  };
  return (
    <>
      <CrudModal
        formTitle={title}
        isOpen={isOpen}
        saveBtnLabel="Lưu"
        handleSave={!isEdit ? undefined : () => {}}
        cancelBtnLabel={!isEdit ? "Đóng" : "Hủy"}
        handleClose={handleCancelForm}
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
                    errorMessage={errors?.name?.message}
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
              alignItems: "flex-start",
              color: "#614C4C",
            }}
          >
            <LabelCustom title="Mô tả" sx={{ display: "flex", alignItems: "center" }} isRequired />
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
                    disabled={true}
                  />
                );
              }}
            />
          </Grid>
        </Grid>
      </CrudModal>
    </>
  );
};

export default AddEditRole;
