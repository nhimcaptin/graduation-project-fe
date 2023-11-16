import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import {
  Grid,
  IconButton,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { visuallyHidden } from "@mui/utils";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { StickyTableCell } from "../../components/StickyTableCell";
import { Order } from "../../utils/sortTable";
import LoadingTableRow from "../../components/LoadingTableRow";
import moment from "moment";
import { FORMAT_DATE, labelDisplayedRows, rowsPerPageOptions } from "../../utils";
import NoDataTableRow from "../../components/NoDataTableRow";
import DISPLAY_TEXTS from "../../consts/display-texts";
import AddEditRole from "./component/AddEditRole";
import IF from "../../components/IF";
import MenuListActions from "../../components/MenuListActions";
import { ButtonIconCustom } from "../../components/ButtonIconCustom";
import apiService from "../../services/api-services";
import URL_PATHS from "../../services/url-path";
import { useSetLoadingScreenState } from "../../redux/store/loadingScreen";

interface RowDataProps {
  id: number;
  roleName: string;
  description: string;
  createdAt: string;
  [x: string]: string | number | boolean | undefined;
  [x: number]: string | number | undefined;
}

const headCells = [
  {
    label: "STT",
    style: { width: "5%" },
  },
  {
    label: "Tên vai trò",
    // sort: "roleName",
    style: { width: "30%" },
  },
  {
    label: "Mô tả",
    // sort: "description",
    style: { width: "60%" },
  },
  { label: "", style: { width: "5%" } },
];

const Role = () => {
  const [orderBy, setOrderBy] = useState<keyof RowDataProps | string>("createdAt");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedItem, setSelectedItem] = useState<RowDataProps | any>();
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [order, setOrder] = useState<Order>("desc");
  const [loadingTable, setLoadingTable] = useState<Boolean>(false);
  const [roleState, setRoleState] = useState<any>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);
  const [permissionList, setPermissionList] = useState<any>([]);
  const [roleDetail, setRoleDetail] = useState<any>([]);
  const [isLoadingResource, setIsLoadingResource] = useState<boolean>(false);

  const { setLoadingScreen } = useSetLoadingScreenState();

  const open = Boolean(anchorEl);
  const menuId = open ? "simple-popover" : undefined;

  const handleCloseActionMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenuAction = (event: React.MouseEvent<HTMLButtonElement>, record: RowDataProps) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(record);
    setRoleDetail(null);
  };

  const createSortHandler = (property: keyof RowDataProps | string) => (event: React.MouseEvent<unknown>) => {
    handleRequestSort(event, property);
  };
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof RowDataProps | string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setSelectedItem(null);
    setRoleDetail(null);
  };

  const handleView = (dataDetail?: any) => {
    setAnchorEl(null);
    setIsEdit(false);
    getDetailRole(dataDetail?.id);
    setTitle("Xem chi tiết");
  };

  const handleEdit = (dataDetail?: any) => {
    setAnchorEl(null);
    setIsEdit(true);
    getDetailRole(dataDetail?.id);
    setTitle("Chỉnh sửa");
  };

  const getResourceActions = async () => {
    setIsLoadingResource(true);
    try {
      const data: any = await apiService.getFilter(URL_PATHS.RESOURCE_ACTION);
      setPermissionList(data);
    } catch (error) {
    } finally {
      setIsLoadingResource(false);
    }
  };

  const getDetailRole = async (id?: any) => {
    setLoadingScreen(true);
    try {
      const data: any = await apiService.getFilter(URL_PATHS.ROLE_GET_DETAIL + `?id=${id || selectedItem?._id}`);
      setRoleDetail(data);
      setIsOpenModal(true);
    } catch (error) {
    } finally {
      setLoadingScreen(false || isLoadingResource);
    }
  };

  const getListRole = async () => {
    setLoadingTable(true);
    try {
      const data: any = await apiService.getFilter(URL_PATHS.ROLE_GET);
      setRoleState(data?.data);
      setTotalCount(data?.totalUsers);
    } catch (error) {
    } finally {
      setLoadingTable(false);
      setLoadingScreen(false);
    }
  };

  useEffect(() => {
    getResourceActions();
    getListRole();
  }, []);

  return (
    <Page className={styles.root} title="Quản lý vai trò" isActive>
      {/* <Grid container style={{ marginBottom: "20px" }}>
        <Grid item xs={10}></Grid>
        <Grid item xs={2}>
          <Box display="flex" justifyContent="flex-end" alignItems="flex-end" height="100%">
            <ButtonIconCustom
              className="mg-l-10"
              tooltipTitle="Thêm mới"
              type="add"
              color="darkgreen"
              onClick={handleOpenModal}
            />
          </Box>
        </Grid>
      </Grid> */}
      <TableContainer component={Paper} sx={{ maxHeight: window.innerHeight - 250 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headCells.map((header: any, index: number) => {
                if (header.label === "Ngày tạo") {
                  return (
                    <StickyTableCell key={index} style={header.style} className={clsx("background-table-header")}>
                      {/* {header.sort ? (
                        <TableSortLabel
                          active={orderBy === header.sort}
                          direction={orderBy === header.sort ? order : "asc"}
                          onClick={createSortHandler(header.sort)}
                        >
                          {header.label}
                          {orderBy === header.sort ? (
                            <Box component="span" sx={visuallyHidden}>
                              {order === "desc" ? "sorted descending" : "sorted ascending"}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      ) : (
                        header.label
                      )} */}
                      {header.label}
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
                            {order === "desc" ? "sorted descending" : "sorted ascending"}
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
            {loadingTable ? (
              <LoadingTableRow colSpan={6} />
            ) : roleState && roleState.length > 0 ? (
              <>
                {roleState.map((data: any, index: number) => {
                  return (
                    <TableRow
                      key={index}
                      hover
                      className={clsx(styles.stickyTableRow, { "highlight-row": data?.isHighlight })}
                    >
                      <TableCell >{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{data.roleName}</TableCell>
                      <TableCell>{data.description}</TableCell>
                      <TableCell>
                        <IconButton aria-label="more" onClick={(e) => handleOpenMenuAction(e, data)}>
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <NoDataTableRow colSpan={6} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={labelDisplayedRows}
        labelRowsPerPage={DISPLAY_TEXTS.rowsPerPage}
      />
      <IF condition={open}>
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
          <MenuListActions actionView={handleView} actionEdit={handleEdit} />
        </Popover>
      </IF>
      {isOpenModal && (
        <AddEditRole
          isOpen={isOpenModal}
          title={title}
          handleClose={handleCloseModal}
          permissionList={permissionList}
          roleDetail={roleDetail}
          isEdit={isEdit}
          getListRole={getListRole}
        />
      )}
    </Page>
  );
};

export default Role;
