import { Box, Button, Card, CardContent, Grid, Menu, MenuItem, Paper, Stack, Typography } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import React, { useState } from "react";
import LoadingIcon from "../../components/LoadingIcon";
import Page from "../../components/Page";
import styles from "./styles.module.scss";
import { data } from "./mockData";
import { TIME_REPORT, numberWithCommas } from "../../utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface TimeReportModel {
  title: string;
  fromDate: string;
  toDate: string;
}

const Dashboard = () => {
  const [loadingCountUsers, setLoadingCountUsers] = useState(false);
  const [countedUserList, setCountedUserList] = useState(0);
  const [loadingCountStaff, setLoadingCountStaff] = useState(false);
  const [countedStaffList, setCountedStaffList] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [timeSelected, setTimeSelected] = useState(TIME_REPORT[2]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectTime = (time: TimeReportModel) => {
    handleClose();
    setTimeSelected(time);
  };

  return (
    <Page className={styles.root} title="Trang chủ" isActive>
      <Grid item xs={12} sx={{ display: "flex" }} mb={2}>
        <div className={styles.card}>
          <Card sx={{ maxWidth: 345, background: "#D1E8F8", borderRadius: "15px" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Số lượng người dùng
              </Typography>
              {loadingCountUsers ? (
                <LoadingIcon />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 800 }} color="text.secondary">
                  {countedUserList || 0}
                </Typography>
              )}
            </CardContent>
          </Card>
        </div>
        <div className={styles.card}>
          <Card sx={{ maxWidth: 345, background: "#FDF5DC", borderRadius: "15px" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Số lượng nhân viên
              </Typography>
              {loadingCountStaff ? (
                <LoadingIcon />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 800 }} color="text.secondary">
                  {countedStaffList || 0}
                </Typography>
              )}
            </CardContent>
          </Card>
        </div>
      </Grid>
      <Paper elevation={3} >
        <Box p={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontSize={14} fontWeight={700} textTransform="uppercase" color={"#614c4c"}>
              Tổng số dịch vụ được sử dụng trong {timeSelected.title}:{" "}
              <Typography component="span" fontSize={14} sx={{ color: "#0c9300" }} fontWeight={700}>
                {numberWithCommas(0)} VND
              </Typography>
            </Typography>
            <Stack direction="row" spacing={2}>
              <Box>
                <Button
                  id="demo-customized-button"
                  aria-controls={!!anchorEl ? "demo-customized-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={!!anchorEl ? "true" : undefined}
                  variant="contained"
                  disableElevation
                  onClick={handleClick}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    backgroundColor: "#0c9300",
                    ":hover": {
                      backgroundColor: "#0c9300",
                      opacity: 0.9,
                    },
                    textTransform: "inherit",
                    fontSize: 14,
                  }}
                >
                  {timeSelected.title}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={!!anchorEl}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  {TIME_REPORT.map((time) => (
                    <MenuItem
                      onClick={() => handleSelectTime(time)}
                      sx={{
                        ...(timeSelected.title === time.title && {
                          backgroundColor: "#c4c4c4",
                        }),
                        fontSize: 14,
                      }}
                    >
                      {time.title}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Stack>
          </Stack>
          <Box height={400} mt={2}>
            <HighchartsReact highcharts={Highcharts} options={data} />
          </Box>
        </Box>
      </Paper>
    </Page>
  );
};

export default Dashboard;
