import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import Page from "../../components/Page";
import styles from "./styles.module.scss";
import logo from "../../assets/images/logo.png";
import { Controller, useForm } from "react-hook-form";
import TextFieldCustom from "../../components/TextFieldCustom";
import Icons from "../../consts/Icons";
import ButtonCustom from "../../components/ButtonCustom";
import ROUTERS_PATHS from "../../consts/router-paths";
import { MESSAGE_ERROR } from "../../consts/messages";
import apiService from "../../services/api-services";
import URL_PATHS from "../../services/url-path";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";
import { STATUS_TOAST } from "../../consts/statusCode";
import { handleErrorMessage } from "../../utils/errorMessage";
import { URL_LOCAL } from "../../services/base-url";
import { RegExpEmail } from "../../utils/regExp";

const ForgotPassword = () => {
  const { setToastInformation } = useSetToastInformationState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmit, setSubmit] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    setSubmit(false);
    try {
      const res: any = await apiService.post(URL_PATHS.SEND_PASSWORD_LINK, data);
      setSubmit(true);
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
    <Page className={styles.root} title="Quên mật khẩu">
      <Container maxWidth="sm" className={styles.cardContainer}>
        <Box
          mb={4}
          style={{ cursor: "pointer" }}
          display="flex"
          justifyContent="center"
          onClick={() => navigate(ROUTERS_PATHS.LOGIN)}
        >
          <img src={logo} />
        </Box>
        <Card className={styles.styleCard} style={{background: isSubmit ? "#e9e9e9" : ""}}>
          {!isSubmit ? (
            <CardContent className={styles.cardContent}>
              <Box alignItems="center" display="flex" justifyContent="center" mb={3}>
                <div>
                  <Typography className={styles.cardTextTitle} gutterBottom>
                    Quên mật khẩu ?
                  </Typography>
                </div>
              </Box>
              <Box flexGrow={1}>
                <form onSubmit={handleSubmit(handleLogin)}>
                  <Grid item xs={12} md={4} xl={4}>
                    <Controller
                      control={control}
                      name="email"
                      rules={{
                        required: MESSAGE_ERROR.fieldRequired,
                        validate: (value: any) => {
                          const result = RegExpEmail(value);
                          return !value || result || MESSAGE_ERROR.RegExpEmail;
                        },
                      }}
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <TextFieldCustom
                          isLogin
                          name={name}
                          className={styles.inputLogin}
                          ref={ref}
                          onChange={onChange}
                          placeholder="Nhập email"
                          type="text"
                          errorMessage={errors?.email?.message}
                          InputProps={{ startAdornment: <Icons.IconUser /> }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} xl={4} sx={{ marginTop: "15px" }}>
                    <ButtonCustom
                      startIcon={<></>}
                      color="green"
                      type="submit"
                      title="Gửi"
                      sx={{ width: "100%" }}
                      loading={isLoading}
                    />
                  </Grid>
                </form>
              </Box>
            </CardContent>
          ) : (
            <Container maxWidth="sm" className={styles.cardContainer}>
              <Box>
                <p style={{ fontSize: "1rem" }}>
                  <span className="required"></span> Bạn đã gửi yêu cầu thành công.
                </p>
                <p style={{ fontSize: "1rem" }}>
                  <span className="required"></span> Vui lòng kiểm tra mail để có thể lấy đường dẫn đổi mật khẩu.
                </p>
              </Box>
            </Container>
          )}
        </Card>
      </Container>
    </Page>
  );
};

export default ForgotPassword;
