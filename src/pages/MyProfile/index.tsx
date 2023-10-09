import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import styles from "./styles.module.scss";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Popover,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  useMediaQuery,
} from "@mui/material";
import clsx from "clsx";
import { StickyTableCell } from "../../components/StickyTableCell";
import { Order } from "../../utils/sortTable";
import { Box, width } from "@mui/system";
import { visuallyHidden } from "@mui/utils";
import LoadingTableRow from "../../components/LoadingTableRow";
import { Link } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NoDataTableRow from "../../components/NoDataTableRow";
import MenuListActions from "../../components/MenuListActions";
import apiService from "../../services/api-services";
import { BASE_URL } from "../../services/base-url";
import URL_PATHS from "../../services/url-path";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";
import { STATUS_TOAST } from "../../consts/statusCode";
import { handleErrorMessage } from "../../utils/errorMessage";
import { labelDisplayedRows, rowsPerPageOptions } from "../../utils";
import { useForm } from "react-hook-form";
import DISPLAY_TEXTS from "../../consts/display-texts";
import SearchPopover from "../../components/SearchPopover";
import LabelCustom from "../../components/LabelCustom";
import { ButtonIconCustom } from "../../components/ButtonIconCustom";
import ButtonCustom from "../../components/ButtonCustom";

const MyProfile = () => {
  const isSmallScreen = useMediaQuery("(max-width: 678px)");

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
                  <strong>Email: </strong>admin34@gmail.com
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <strong>Organization: </strong>400
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
                <ButtonCustom type="button" className={styles.custom_button}>
                  Change Password
                </ButtonCustom>
              </Grid>
              <Grid item>
                <ButtonCustom type="button" className={styles.custom_button}>
                  Edit profile
                </ButtonCustom>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
};

export default MyProfile;
