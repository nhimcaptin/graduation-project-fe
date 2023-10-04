import { AppBar, Box, MenuItem, MenuList, Popover, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ELEMENT_ID from "../../consts/element";
import styles from "./styles.module.scss";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL, IMG_URL } from "../../services/base-url";
import avatarDefault from "../../assets/images/avatar-default.png";
import { Link, useLocation } from "react-router-dom";
import ROUTERS_PATHS from "../../consts/router-paths";
import clsx from "clsx";
import useAuth from "../../hook/useAuth";
import Icons from "../../consts/Icons";

const Header = () => {
  const anchorElRef = useRef(null);
  const location = useLocation();
  const { logout } = useAuth();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const { currentUser } = useSelector((state: any) => state.currentUser);
  const isChangeForm = useSelector((state: any) => state.checkingChanges.isChange);
  const { pathname } = location;

  const ImageSrc = `${IMG_URL}${currentUser.avatar}`;
  const idAction = openMenu ? "simple-popover" : undefined;

  const handleClosePopover = () => {
    setOpenMenu(false);
  };

  const getPath = (path: string) => {
    if (path === pathname) {
      return path;
    } else {
      if (isChangeForm) {
        return "#";
      } else {
        return path;
      }
    }
  };

  const handleCheckFormChanges = (href: string) => {
    // if (isChangeForm) {
    //     openConfirmModal({
    //         isOpen: true,
    //         title: 'Cảnh báo',
    //         message: MESSAGES_CONFIRM.CheckingChanges,
    //         cancelBtnLabel: 'Hủy',
    //         okBtnLabel: 'Xác nhận',
    //         isDeleteConfirm: false,
    //         onOk: () => onNavigate(href)
    //     });
    // }
  };

  const logOutAccount = async () => {
    try {
      //   const res = await apiService.post(URL_PATHS.LOG_OUT);
      logout();
      //   return res;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AppBar className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        <Typography
          className={styles.breadCrumbsContainer}
          id={ELEMENT_ID.BREADCRUMB_CONTAINER}
          variant="h5"
          component="h5"
          gutterBottom
        >
          Khách hàng
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            position: "absolute",
            right: "20px",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            ref={anchorElRef}
            onClick={(e) => setOpenMenu(true)}
          >
            <div className={styles.textContainer}>
              <p className={styles.userName}>{currentUser?.firstName} Admin nè</p>
            </div>
            <img
              src={currentUser.avatar ? ImageSrc : avatarDefault}
              width={40}
              height={40}
              style={{ borderRadius: "50%" }}
              alt="avatarAdmin"
            />
          </Box>
          <Popover
            id={idAction}
            open={openMenu}
            anchorEl={anchorElRef.current}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuList>
              <Link
                style={{ textDecoration: "unset", color: "#614C4C" }}
                to={getPath(ROUTERS_PATHS.MY_PROFILE)}
                onClick={
                  getPath(ROUTERS_PATHS.MY_PROFILE) === "#"
                    ? () => handleCheckFormChanges(ROUTERS_PATHS.MY_PROFILE)
                    : undefined
                }
              >
                <MenuItem
                  key="1"
                  className={clsx({
                    [styles.menuItem]: true,
                    [styles.menuItemLogOut]: true,
                  })}
                  onClick={() => handleClosePopover()}
                >
                  Tài khoản
                  <Icons.Profile style={{ marginLeft: "10px" }} />
                </MenuItem>
              </Link>

              <MenuItem
                key="1"
                className={clsx({
                  [styles.menuItem]: true,
                  [styles.menuItemLogOut]: true,
                })}
                onClick={() => logOutAccount()}
              >
                Đăng xuất
                <LogoutIcon color="error" sx={{ marginLeft: "10px" }} />
              </MenuItem>
            </MenuList>
          </Popover>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
