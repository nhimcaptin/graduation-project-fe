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
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import apiService from "../../../../services/api-services";
import { BASE_URL } from "../../../../services/base-url";
import URL_PATHS from "../../../../services/url-path";
import { useSetToastInformationState } from "../../../../redux/store/ToastMessage";
import { STATUS_TOAST } from "../../../../consts/statusCode";
interface PropsType {
  isOpen: boolean;
  dataDetail: UserDetail;
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

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center", // Để căn giữa theo chiều dọc
    padding: 0,
    width: "100%", // Rộng 100% phần tử cha
  },
  imageContainer: {
    flex: "0 0 auto", // Không đặt động co giãn cho phần này
    marginRight: 5, // Khoảng cách giữa ảnh và nội dung
  },
  image: {
    width: "100px", // Độ rộng của ảnh
    height: "100px", // Độ cao của ảnh
    objectFit: "cover", // Để ảnh không bị méo
  },
  content: {
    marginLeft: "10%",
    flex: "1", // Phần thông tin co giãn để lấp đầy phần còn lại
  },
}));
const EditStaff = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel, dataDetail } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [loadingTable, setLoadingTable] = useState<Boolean>(true);
  // Sử dụng state để lưu thông tin chỉnh sửa
  const [formData, setFormData] = useState<UserDetail | null>(null);
  const { setToastInformation } = useSetToastInformationState();
  // Đặt giá trị ban đầu của formData khi có thông tin có sẵn
  useEffect(() => {
    setFormData(dataDetail);
  }, [dataDetail]);

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
      await apiService.put(
        BASE_URL + URL_PATHS.CREATE_USER + "/" + formData._id,
        formData
      );
      console.log("Updated User Info:", formData);
      loadingTable;
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: "Sửa thành công!!!",
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
      <div>
        {formData ? (
          <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: "20px" }}>
              <form onSubmit={(e) => e.preventDefault()}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <TextField
                      label="Tên"
                      variant="outlined"
                      fullWidth
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Số điện thoại"
                      variant="outlined"
                      fullWidth
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Container>
        ) : (
          <p>Không có thông tin người dùng để hiển thị.</p>
        )}
      </div>
    </CrudModal>
  );
};

export default EditStaff;
