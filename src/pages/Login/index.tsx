import { useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import Page from "../../components/Page";
import styles from "./styles.module.scss";
import logo from "../../assets/images/logo.png";
import { Controller, useForm } from "react-hook-form";
import TextFieldCustom from "../../components/TextFieldCustom";
import Icons from "../../consts/Icons";
import {ILogin} from "./interface";

const Login = () => {
  // const { login } = useAuth();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILogin>();

  const handleLogin = (data: ILogin) => {
    try {
      const submitData = {
        token: "This is token",
        responseUserInfo: {
          statusCode: 200,
        },
      };
      // login(submitData);
      navigate("/", { replace: false });
    } catch (error) {}
  };

  return (
    <Page className={styles.root} title="Đăng nhập">
      <Container maxWidth="sm" className={styles.cardContainer}>
        <Box mb={4} display="flex" justifyContent="center">
          <img src={logo} />
        </Box>
        <Card className={styles.styleCard}>
          <CardContent className={styles.cardContent}>
            <Box
              alignItems="center"
              display="flex"
              justifyContent="center"
              mb={3}
            >
              <div>
                <Typography className={styles.cardTextTitle} gutterBottom>
                  Đăng nhập
                </Typography>
              </div>
            </Box>

            <Box flexGrow={1}>
            <Icons.IconUser />
              {/* <form onSubmit={handleSubmit(handleLogin)}>
                <Controller
                  control={control}
                  name="userName"
                  render={({
                    field: { onChange, onBlur, value, ref, name },
                  }) => (
                    <TextFieldCustom
                      name={name}
                      ref={ref}
                      onChange={onChange}
                      placeholder="Nhập tên đăng nhập"
                      type="text"
                      errorMessage={errors?.userName?.message}
                      // InputProps={{ startAdornment: <Icons.IconUser /> }}
                    />
                  )}
                />
              </form> */}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default Login;
