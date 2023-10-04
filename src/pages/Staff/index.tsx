import React, { useEffect, useMemo, useState } from "react";
import Page from "../../components/Page";
import styles from "./styles.module.scss";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Popover,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
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
import { async } from "q";

interface RowDataProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdDate: string;
  [x: string]: string | number | boolean | undefined;
  [x: number]: string | number | undefined;
}

const headCells = [
  {
    label: "Họ và tên",
    sort: "name",
    style: { maxWidth: "30%", minWidth: "180px" },
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
  { label: "Action", style: { minWidth: "5%" } },
  { label: "", style: { minWidth: "0%" } },
];

const User = () => {
  const [loadingTable, setLoadingTable] = useState<Boolean>(true);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof RowDataProps | string>(
    "createdDate"
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedItem, setSelectedItem] = useState<RowDataProps | any>();

  const open = Boolean(anchorEl);
  const menuId = open ? "simple-popover" : undefined;

  const [staffs, setData] = useState<any>([]);

  const createSortHandler =
    (property: keyof RowDataProps | string) =>
    (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof RowDataProps | string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    getData({ sortBy: property, sortDirection: isAsc ? "desc" : "asc" });
  };

  const handleOpenMenuAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    record: RowDataProps
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(record);
  };

  const handleCloseActionMenu = () => {
    setAnchorEl(null);
  };

  const getData = async (props: any) => {
    apiService
      .get(BASE_URL + URL_PATHS.DETAIL_USER1)
      .then((response: any) => {
        // Xử lý dữ liệu khi yêu cầu thành công
        console.log("Dữ liệu từ server:", response.users);
        setData(response.users);
      })
      .catch((error) => {
        // Xử lý lỗi khi yêu cầu thất bại
        console.error("Lỗi yêu cầu:", error);
      });
  };

  const [userToDelete, setUserToDelete] = useState<any>(staffs);

  // Hàm xử lý việc xóa người dùng
  const deleteUser = (userId: string) => {
    // Gửi yêu cầu xóa người dùng đến máy chủ thông qua API
    console.log(BASE_URL + URL_PATHS.GET_USER + "/" + userId);
    // Đảm bảo thay thế 'your-api-endpoint' bằng đúng đường dẫn của API xóa người dùng
    apiService
      .delete(BASE_URL + URL_PATHS.GET_USER + "/" + userId)
      .then((res: any) => {
        setAnchorEl(null);
        getData();
      });
  };

  // Hàm xử lý sự kiện xóa người dùng
  const handleDelete = (id: string) => {
    if (id) {
      deleteUser(id);
      setUserToDelete(staffs);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Page className={styles.root} title="Khách hàng" isActive>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: window.innerHeight - 250 }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headCells.map((header: any, index: number) => {
                if (header.label === "Ngày tạo") {
                  return (
                    <StickyTableCell
                      key={index}
                      style={header.style}
                      className={clsx("background-table-header")}
                    >
                      {header.sort ? (
                        <TableSortLabel
                          active={orderBy === header.sort}
                          direction={orderBy === header.sort ? order : "asc"}
                          onClick={createSortHandler(header.sort)}
                        >
                          {header.label}
                          {orderBy === header.sort ? (
                            <Box component="span" sx={visuallyHidden}>
                              {order === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      ) : (
                        header.label
                      )}
                    </StickyTableCell>
                  );
                }
                return (
                  <TableCell
                    key={index}
                    style={header.style}
                    sx={{ fontWeight: "bold", marginTop: "5%" }}
                    className={clsx("background-table-header")}
                    sortDirection={orderBy === header.sort ? order : false}
                  >
                    {header.sort ? (
                      <TableSortLabel
                        active={orderBy === header.sort}
                        direction={orderBy === header.sort ? order : "asc"}
                        onClick={createSortHandler(header.sort)}
                      >
                        {header.label}
                        {orderBy === header.sort ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      header.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingTable && false ? (
              <LoadingTableRow colSpan={6} />
            ) : staffs && staffs.length > 0 ? (
              <>
                {staffs.map((data: any, index: number) => {
                  const rowId = data;
                  return (
                    <TableRow
                      key={index}
                      hover
                      className={clsx(styles.stickyTableRow)}
                    >
                      {/* <StickyTableCell className={style.stickyTableCell}>
                        <Link to={ROUTERS_PATHS.VIEW_STORE.replace(":id", data.id + "")} className={style.linkToDetail}>
                          {data.name}
                        </Link>
                      </StickyTableCell> */}
                      <TableCell>{data.name}</TableCell>
                      <TableCell className="">{data.email}</TableCell>
                      <TableCell className="">{data.phone}</TableCell>
                      <TableCell>{data.address}</TableCell>
                      <TableCell>{data.updatedAt}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="more"
                          onClick={(e) => handleOpenMenuAction(e, data)}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {open && (
                          <Popover
                            id={menuId}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleCloseActionMenu}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                          >
                            <MenuListActions
                              actionView={(e) => console.log(selectedItem._id)}
                            />
                            <MenuListActions actionEdit={(e) => {}} />
                            <MenuListActions
                              actionDelete={(e) =>
                                handleDelete(selectedItem._id)
                              }
                            />
                          </Popover>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={8}>
                  <Skeleton variant="text" width="100%" height={40} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
  );
};

export default User;
