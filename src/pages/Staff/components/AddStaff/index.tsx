import React, { useEffect, useState } from "react";
import CrudModal from "../../../../components/CrudModal";
import {
  Avatar,
  Card,
  CardContent,
  Paper,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  Box,
  createTheme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import apiService from "../../../../services/api-services";
import { BASE_URL } from "../../../../services/base-url";
import URL_PATHS from "../../../../services/url-path";
import { useSetToastInformationState } from "../../../../redux/store/ToastMessage";
import { STATUS_TOAST } from "../../../../consts/statusCode";
interface PropsType {
  isOpen: boolean;
  title: string;
  onCancel: (parameter: any) => void;
  isEdit: boolean;
}
interface UserDetail {
  [x: string]: unknown;
  id: string;
  name: string;
  email: string;
  address: string;
  // Thêm các trường dữ liệu khác của người dùng tại đây
}

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      fontSize: 16,
      fontWeight: "500",
    },
  },
});
const AddStaff = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [loadingTable, setLoadingTable] = useState<Boolean>(true);
  // Sử dụng state để lưu thông tin chỉnh sửa
  const [formData, setFormData] = useState<UserDetail | null>(null);
  const { setToastInformation } = useSetToastInformationState();
  // Đặt giá trị ban đầu của formData khi có thông tin có sẵn

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    if (formData) {
      // Xử lý cập nhật thông tin có sẵn dựa trên formData ở đây
      await apiService.post(BASE_URL + URL_PATHS.CREATE_USER, formData);
      console.log("Updated User Info:", formData);
      loadingTable;
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: "Thêm thành công!!!",
      });
    }
  };

  return (
    <CrudModal
      isOpen={isOpen}
      formTitle={title}
      handleSave={isEdit ? handleSubmit : undefined}
      handleClose={onCancel}
      cancelBtnLabel="Hủy"
      saveBtnLabel="Lưu"
      dialogProps={{
        fullWidth: true,
        maxWidth: "md",
      }}
    >
      <section>
        {formData ? (
          <Box>
            <form onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                <Typography>Số điện thoại</Typography>
                  <TextField
                    label="Tên"
                    variant="outlined"
                    fullWidth
                    name="name"
                    // value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                <Typography>Số điện thoại</Typography>
                  <TextField
                    label="Số điện thoại"
                    variant="outlined"
                    fullWidth
                    name="phone"
                    // value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                <Typography>Email</Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="email"
                    // value={formData.email}
                    onChange={handleChange}
                   
                  />
                </Grid>
              </Grid>
            </form>
          </Box>
        ) : (
          <p>Không có thông tin người dùng để hiển thị edit.</p>
        )}
      </section>
    </CrudModal>
  );
};

export default AddStaff;
