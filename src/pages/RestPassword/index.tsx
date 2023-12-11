import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import { Box, Card, CardContent, Container, Grid, InputAdornment, Typography } from "@mui/material";
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
import { RegExpEmail, RegPassword } from "../../utils/regExp";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const RestPassword = () => {
  const { setToastInformation } = useSetToastInformationState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmit, setSubmit] = useState<boolean>(false);
  const [hiddenNewPassword, setHiddenNewPassword] = useState(false);
  const [hiddenConfirmPassword, setHiddenConfirmPassword] = useState(false);
  const [isActiveUrl, setIsActiveUrl] = useState(false);
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const token = urlParams.get("token");

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const handleReset = async (data: any) => {
    setIsLoading(true);
    setSubmit(false);
    try {
      const res: any = await apiService.post(`${URL_PATHS.REST_PASSWORD}/${id}/${token}`, data);
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

  useEffect(() => {
    (async () => {
      try {
        const res: any = await apiService.get(`${URL_PATHS.FORGOT_PASSWORD}/${id}/${token}`);
        setIsActiveUrl(true);
      } catch (error: any) {
        setIsActiveUrl(false);
      } finally {
      }
    })();
  }, []);

  return (
    <Page className={styles.root} title="Đổi mật khẩu">
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
        <Card className={styles.styleCard} style={{ background: isSubmit ? "#e9e9e9" : "" }}>
          {isActiveUrl ? (
            !isSubmit ? (
              <CardContent className={styles.cardContent}>
                <Box alignItems="center" display="flex" justifyContent="center" mb={3}>
                  <div>
                    <Typography className={styles.cardTextTitle} gutterBottom>
                      Đổi mật khẩu
                    </Typography>
                  </div>
                </Box>
                <Box flexGrow={1}>
                  <form onSubmit={handleSubmit(handleReset)}>
                    <Grid item xs={12} mt={2}>
                      <Controller
                        name="password"
                        rules={{
                          required: MESSAGE_ERROR.fieldRequired,
                          validate: (value: any) => {
                            const result = RegPassword(value);
                            return !value || result;
                          },
                        }}
                        control={control}
                        render={({ field: { onChange, onBlur, value, ref, name } }: any) => (
                          <TextFieldCustom
                            isLogin
                            name={name}
                            className={styles.inputLogin}
                            ref={ref}
                            onChange={onChange}
                            placeholder="Nhập mật khẩu mới"
                            type={hiddenNewPassword ? "text" : "password"}
                            errorMessage={errors?.password?.message}
                            InputProps={{
                              startAdornment: <Icons.IconPassword />,
                              endAdornment: (
                                <InputAdornment sx={{ cursor: "pointer" }} position="start">
                                  <Box
                                    onClick={() =>
                                      hiddenNewPassword
                                        ? setHiddenNewPassword(!hiddenNewPassword)
                                        : setHiddenNewPassword(!hiddenNewPassword)
                                    }
                                  >
                                    {hiddenNewPassword ? <Icons.eyes /> : <Icons.eyesHidden />}
                                  </Box>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} mt={2}>
                      <Controller
                        name="confirmPassword"
                        rules={{
                          required: MESSAGE_ERROR.fieldRequired,
                          validate: (value: any) => value?.trim() === watch("password") || MESSAGE_ERROR.watchPassword,
                        }}
                        control={control}
                        render={({ field: { onChange, onBlur, value, ref, name } }: any) => (
                          <TextFieldCustom
                            isLogin
                            name={name}
                            className={styles.inputLogin}
                            ref={ref}
                            onChange={onChange}
                            placeholder="Nhập lại mật khẩu"
                            type={hiddenConfirmPassword ? "text" : "password"}
                            errorMessage={errors?.confirmPassword?.message}
                            InputProps={{
                              startAdornment: <Icons.IconPassword />,
                              endAdornment: (
                                <InputAdornment sx={{ cursor: "pointer" }} position="start">
                                  <Box
                                    onClick={() =>
                                      hiddenConfirmPassword
                                        ? setHiddenConfirmPassword(!hiddenConfirmPassword)
                                        : setHiddenConfirmPassword(!hiddenConfirmPassword)
                                    }
                                  >
                                    {hiddenConfirmPassword ? <Icons.eyes /> : <Icons.eyesHidden />}
                                  </Box>
                                </InputAdornment>
                              ),
                            }}
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
                  <Box display={"flex"} justifyContent={"center"}>
                    <DoneAllIcon sx={{ color: "green", fontSize: "7rem", textAlign: "center" }} />
                  </Box>
                  <p style={{ fontSize: "1.5rem", textAlign: "center" }}>Bạn đã đổi mật khẩu thành công.</p>
                </Box>
              </Container>
            )
          ) : (
            <Container maxWidth="sm" className={styles.cardContainer}>
              <Box>
                <Box display={"flex"} justifyContent={"center"}>
                  <ReportProblemIcon sx={{ color: "#df0606", fontSize: "7rem", textAlign: "center" }} />
                </Box>
                <p style={{ fontSize: "1.5rem", textAlign: "center", color: "#df0606" }}>
                  Đường dẫn không tồn tại hoặc đã hết thời gian sử dụng
                </p>
              </Box>
            </Container>
          )}
        </Card>
      </Container>
    </Page>
  );
};

export default RestPassword;
