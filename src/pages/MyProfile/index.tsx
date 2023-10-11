import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import styles from "./styles.module.scss";
import {
  Avatar,
  Grid,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ButtonCustom from "../../components/ButtonCustom";
import { useSelector } from "react-redux";
import ChangePassword from "./component/ChangePassword/ChangePassword";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";
import { useForm } from "react-hook-form";
const MyProfile = () => {
  const isSmallScreen = useMediaQuery("(max-width: 678px)");
  const [loadingTable, setLoadingTable] = useState<Boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { setToastInformation } = useSetToastInformationState();
  const [totalCount, setTotalCount] = useState<number>(0);
  const open = Boolean(anchorEl);
  const menuId = open ? "simple-popover" : undefined;
  const { control, handleSubmit, reset, setValue, watch } = useForm();
  const [staffs, setData] = useState<any>([]);
  const [filterContext, setFilterContext] = useState<any>({});
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [isViewMode, setIsViewMode] = useState<boolean>(false);

  const { currentUser } = useSelector((state: any) => state.currentUser);
  console.log(currentUser);

  const handleCancel = () => {
    setIsOpenModal(false);
  };
  const handleOpenModal = () => {
    setIsOpenModal(true);
    setTitle("Change Password");
  };
  return (
    <Page className={styles.root} title="My Profile" isActive>
      <Grid container justifyContent="center">
        <Grid
          item
          xs={18}
          md={18}
          lg={18}
          sx={{
            padding: isSmallScreen ? "20px" : "50px 30px",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              backgroundColor: "white",
              borderRadius: 5,
              padding: isSmallScreen ? "20px" : "50px",
            }}
          >
            <Typography
              variant={isSmallScreen ? "h6" : "h4"}
              style={{
                fontFamily: "Fira Sans, sans-serif",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
              gutterBottom
            >
              My Profile
            </Typography>

            {/* Hàng 2 */}
            <Stack
              direction={isSmallScreen ? "column" : "row"}
              alignItems={isSmallScreen ? "center" : "flex-start"}
              spacing={isSmallScreen ? 2 : 4}
            >
              <Avatar
                alt="Remy Sharp"
                sx={{
                  width: isSmallScreen ? 150 : 200,
                  height: isSmallScreen ? 150 : 200,
                }}
                src="/static/images/avatar/1.jpg"
              />

              <Grid
                style={{
                  marginLeft: isSmallScreen ? "0" : "50px",
                  marginTop: isSmallScreen ? "20px" : "0",
                }}
              >
                <Typography
                  variant="h3"
                  style={{
                    fontFamily: "Fira Sans, sans-serif",
                    fontSize: isSmallScreen ? "30px" : "50px",
                    marginBottom: "20px",
                  }}
                  gutterBottom
                >
                  Administrator Application
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <strong>Email: </strong>
                  {currentUser?.email}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <strong>Organization: </strong>
                  {"200"}
                </Typography>
              </Grid>
            </Stack>

            {/* Hàng 3 */}
            <Grid
              container
              justifyContent={isSmallScreen ? "center" : "flex-end"}
              spacing={2}
            >
              <Grid item>
                <ButtonCustom
                  type="button"
                  className={styles.custom_button}
                  title="Change Password"
                  onClick={handleOpenModal}
                ></ButtonCustom>
              </Grid>
              <Grid item>
                <ButtonCustom
                  type="button"
                  className={styles.custom_button}
                  onClick={handleOpenModal}
                  title="Edit profile"
                ></ButtonCustom>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      {isOpenModal && (
        <ChangePassword
          isOpen={isOpenModal}
          title={title}
          onCancel={handleCancel}
          isEdit={!isViewMode}
          dataDetail={currentUser}
        />
      )}
    </Page>
  );
};

export default MyProfile;
