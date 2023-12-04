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
import { ILogin } from "./interface";
import ButtonCustom from "../../components/ButtonCustom";
import ROUTERS_PATHS from "../../consts/router-paths";
import { MESSAGE_ERROR } from "../../consts/messages";
import apiService from "../../services/api-services";
import URL_PATHS from "../../services/url-path";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";
import { STATUS_TOAST } from "../../consts/statusCode";
import { handleErrorMessage } from "../../utils/errorMessage";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { setToastInformation } = useSetToastInformationState();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILogin>();

  const handleLogin = async (data: ILogin) => {
    try {
      setIsLoading(true);
      const _data = {
        email: data.userName,
        password: data.password,
      };
      const res: any = await apiService.post(URL_PATHS.LOGIN, _data);
      const submitData = {
        token: res?.access_token,
        responseUserInfo: {
          statusCode: 200,
        },
      };
      await login(submitData);
      navigate("/", { replace: false });
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleLogin = async (data: ILogin) => {
  //   const _data = {
  //     amount: 10000,
  //     orderType: "other",
  //     orderDescription: "Thanh+toan+don+hang"
  //   };
  //   const res: any = await apiService.post("api/create_payment_url", _data);
  //   window.open(res?.vnpUrl);
  // };

  return (
    <Page className={styles.root} title="Đăng nhập">
      <Container maxWidth="sm" className={styles.cardContainer}>
        <Box mb={4} display="flex" justifyContent="center">
          <img src={logo} />
        </Box>
        <Card className={styles.styleCard}>
          <CardContent className={styles.cardContent}>
            <Box alignItems="center" display="flex" justifyContent="center" mb={3}>
              <div>
                <Typography className={styles.cardTextTitle} gutterBottom>
                  Đăng nhập
                </Typography>
              </div>
            </Box>

            <Box flexGrow={1}>
              <form onSubmit={handleSubmit(handleLogin)}>
                <Grid item xs={12} md={4} xl={4}>
                  <Controller
                    control={control}
                    name="userName"
                    rules={{
                      required: MESSAGE_ERROR.fieldRequired,
                    }}
                    render={({ field: { onChange, onBlur, value, ref, name } }) => (
                      <TextFieldCustom
                        isLogin
                        name={name}
                        className={styles.inputLogin}
                        ref={ref}
                        onChange={onChange}
                        placeholder="Nhập tên đăng nhập"
                        type="text"
                        errorMessage={errors?.userName?.message}
                        InputProps={{ startAdornment: <Icons.IconUser /> }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4} xl={4} sx={{ marginTop: "15px" }}>
                  <Controller
                    control={control}
                    name="password"
                    rules={{
                      required: MESSAGE_ERROR.fieldRequired,
                    }}
                    render={({ field: { onChange, onBlur, value, ref, name } }) => (
                      <TextFieldCustom
                        isLogin
                        name={name}
                        className={styles.inputLogin}
                        ref={ref}
                        onChange={onChange}
                        placeholder="Nhập mật khẩu"
                        type="password"
                        errorMessage={errors?.password?.message}
                        InputProps={{ startAdornment: <Icons.IconPassword /> }}
                      />
                    )}
                  />
                </Grid>
                <Box mt={1} mr={1}>
                  <Link to={ROUTERS_PATHS.FORGOT_PASSWORD} className={styles.textForgotPass}>
                    Quên mật khẩu?
                  </Link>
                </Box>

                <Grid item xs={12} md={4} xl={4} sx={{ marginTop: "15px" }}>
                  <ButtonCustom
                    startIcon={<></>}
                    color="green"
                    type="submit"
                    title="Đăng nhập"
                    sx={{ width: "100%" }}
                    loading={isLoading}
                  />
                </Grid>
              </form>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default Login;
