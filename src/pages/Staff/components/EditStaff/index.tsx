import React, { useEffect, useState } from "react";
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
import { useSetToastInformationState } from "../../../../redux/store/ToastMessage";
import { STATUS_TOAST } from "../../../../consts/statusCode";
import moment from "moment";
import { FORMAT_DATE } from "../../../../utils";
import apiService from "../../../../services/api-services";
import { BASE_URL } from "../../../../services/base-url";
import URL_PATHS from "../../../../services/url-path";

interface PropsType {
  isOpen: boolean;
  dataDetail: UserDetail;
  title: string;
  onCancel: () => any;
  isEdit: boolean;
  onSave: (formData: UserDetail) => void;
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

type UserDetailField = keyof UserDetail;

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

// Định nghĩa các trường và giao diện hiển thị
const headCells = [
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

const EditStaff = (props: PropsType) => {
  const { isOpen, title, isEdit, onCancel, dataDetail, onSave } = props;
  const { setToastInformation } = useSetToastInformationState();
  const [formData, setFormData] = useState<UserDetail | undefined>(dataDetail);
  const [isFormOpen, setIsFormOpen] = useState(true);

  useEffect(() => {
    setFormData(dataDetail);
  }, [dataDetail]);

  const isFieldEmpty = (fieldName: UserDetailField) => {
    return !formData || !formData[fieldName];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const { name, value } = e.target;

      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleCancel = () => {
    // Gọi onCancel prop để đóng popup
    onCancel();
  };
  const handleSubmit = async () => {
    if (formData) {
      if (
        isFieldEmpty("name") ||
        isFieldEmpty("email") ||
        isFieldEmpty("phone") ||
        isFieldEmpty("img") ||
        isFieldEmpty("address")
      ) {
        setToastInformation({
          status: STATUS_TOAST.ERROR,
          message: "Vui lòng không để trống các trường!!!",
        });
        return; // Ngăn chặn việc submit nếu có trường nào đó trống
      }
      await apiService.put(
        BASE_URL + URL_PATHS.CREATE_USER + "/" + formData._id,
        formData
      );
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: "Thêm thành công!!!",
      });
      onSave(formData);
      handleCancel();
    }
  };

  return (
    <CrudModal
      isOpen={isOpen}
      formTitle={title}
      handleSave={isEdit ? handleSubmit : undefined}
      handleClose={handleCancel}
      cancelBtnLabel="Hủy"
      saveBtnLabel="Lưu"
      dialogProps={{
        fullWidth: true,
        maxWidth: "md",
      }}
    >
      <section>
        {formData ? (
          <ThemeProvider theme={theme}>
            <Box>
              <Grid container spacing={3}>
                {headCells.map((header, index) => (
                  <Grid item xs={6} key={header.label}>
                    <Typography>{header.label}</Typography>
                    {header.sort === "createdDate" ? (
                      <TextField
                        variant="outlined"
                        fullWidth
                        name={header.sort}
                        value={
                          moment(dataDetail[header.sort]).format(FORMAT_DATE) // Định dạng thời gian theo ý muốn
                        }
                        disabled={!isEdit}
                      />
                    ) : (
                      <TextField
                        error={
                          isFieldEmpty(header.sort as UserDetailField) && isEdit
                        }
                        variant="outlined"
                        fullWidth
                        name={header.sort as UserDetailField}
                        value={formData[header.sort as UserDetailField]}
                        onChange={handleChange}
                        disabled={!isEdit}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </ThemeProvider>
        ) : (
          <p>Không có thông tin người dùng để hiển thị.Edit</p>
        )}
      </section>
    </CrudModal>
  );
};

export default EditStaff;
