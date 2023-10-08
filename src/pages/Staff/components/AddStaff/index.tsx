import React from "react";
import CrudModal from "../../../../components/CrudModal";
import { Avatar, Card, CardContent, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

interface PropsType {
  isOpen: boolean;
  dataDetail: UserDetail;
  title: string;
  onCancel: (parameter: any) => void;
  isEdit: boolean;
}
interface UserDetail {
  id: string;
  name: string;
  email: string;
  address: string;
  img:string
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

const AddStaff = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel, dataDetail } = props;
  const classes = useStyles();

  return (
    <CrudModal
      isOpen={isOpen}
      formTitle={title}
      handleSave={isEdit ? () => {} : undefined}
      handleClose={onCancel}
      cancelBtnLabel="Hủy"
      saveBtnLabel="Lưu"
      
      isDisable={true}
      dialogProps={{
        fullWidth: true,
        maxWidth: "md",
      }}
    >
      {dataDetail  ? (
        <Paper elevation={3} className={classes.root}>
          <section className={classes.imageContainer}>
            <img
              src={dataDetail.img}
              alt="Ảnh người dùng"
              className={classes.image}
            />
          </section>
          <section className={classes.content}>
            <Typography variant="h6">Tên: {dataDetail.name}</Typography>
            <Typography>Email: {dataDetail.email}</Typography>
            <Typography>Địa chỉ: {dataDetail.address}</Typography>
            {/* Thêm thông tin khác tại đây */}
          </section>
        </Paper>
      ) : (
        <p>Không có thông tin người dùng để hiển thị.</p>
      )}
    </CrudModal>
  );
};

export default AddStaff;
