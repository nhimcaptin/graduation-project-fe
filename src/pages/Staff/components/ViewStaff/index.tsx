

import React from "react";
import CrudModal from "../../../../components/CrudModal";
import {
  Box,
  Grid,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { format } from "date-fns";
import moment from "moment";
import { FORMAT_DATE } from "../../../../utils";

interface PropsType {
  isOpen: boolean;
  dataDetail: UserDetail;
  title: string;
  onCancel: (parameter: any) => void;
  isEdit: boolean;
}
interface UserDetail {
  _id: string;
  name: string;
  email: string;
  address: string;
  img: string;
  phone: string;
  createdDate: Date;
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

interface HeaderCell {
  label: string;
  sort: keyof UserDetail;
  style: React.CSSProperties;
}

const headCells: HeaderCell[] = [
  {
    label: "Họ và tên",
    sort: "name",
    style: { maxWidth: "30%", minWidth: "180px" },
  },
  {
    label: "Image",
    sort: "img",
    style: { maxWidth: "20%", minWidth: "180px" },
  },
  {
    label: "Email",
    sort: "email",
    style: { maxWidth: "20%", minWidth: "180px" },
  },
  {
    label: "Số điện thoại",
    sort: "phone",
    style: { maxWidth: "20%", minWidth: "180px" },
  },
  {
    label: "Địa chỉ",
    sort: "address",
    style: { maxWidth: "20%", minWidth: "180px" },
  },
  {
    label: "Ngày tạo",
    sort: "createdDate",
    style: { maxWidth: "20%", minWidth: "180px" },
  },
];

const ViewStaff = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel, dataDetail } = props;

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
      {dataDetail ? (
        <ThemeProvider theme={theme}>
          <Box>
            <Grid container spacing={3}>
              {headCells.map((header: HeaderCell, index: number) => (
                <Grid item xs={6} key={header.label}>
                  <Typography>{header.label}</Typography>
                  {header.sort === "createdDate" ? (
                    // Định dạng và hiển thị thời gian nếu trường là "createdDate"
                    <TextField
                      variant="outlined"
                      fullWidth
                      name={header.sort}
                      value={
                        moment(dataDetail[header.sort]).format(FORMAT_DATE) // Định dạng thời gian theo ý muốn
                      }
                      disabled
                    />
                  ) : (
                    // Hiển thị trường khác mà không cần định dạng
                    <TextField
                      variant="outlined"
                      fullWidth
                      name={header.sort}
                      value={dataDetail[header.sort]}
                      disabled
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        </ThemeProvider>
      ) : (
        <p>Không có thông tin người dùng để hiển thị view.</p>
      )}
    </CrudModal>
  );
};

export default ViewStaff;
