import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import styles from "./styles.module.scss";
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
import clsx from "clsx";
import { StickyTableCell } from "../../components/StickyTableCell";
import { Order } from "../../utils/sortTable";
import { Box } from "@mui/system";
import { visuallyHidden } from "@mui/utils";
import LoadingTableRow from "../../components/LoadingTableRow";
import { Link } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NoDataTableRow from "../../components/NoDataTableRow";
import MenuListActions from "../../components/MenuListActions";
import SearchPopover from "../../components/SearchPopover";
import LabelCustom from "../../components/LabelCustom";
import { ButtonIconCustom } from "../../components/ButtonIconCustom";
import { Controller, useForm } from "react-hook-form";
import { FORMAT_DATE, getRowStatus, labelDisplayedRows, rowsPerPageOptions } from "../../utils";
import DISPLAY_TEXTS from "../../consts/display-texts";
import apiService from "../../services/api-services";
import URL_PATHS from "../../services/url-path";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";
import { STATUS_TOAST } from "../../consts/statusCode";
import { handleErrorMessage } from "../../utils/errorMessage";
import moment from "moment";
import { useSetConfirmModalState } from "../../redux/store/confirmModal";
import { MESSAGES_CONFIRM, MESSAGE_SUCCESS } from "../../consts/messages";
import IF from "../../components/IF";
import { useSetLoadingScreenState } from "../../redux/store/loadingScreen";
import TextFieldCustom from "../../components/TextFieldCustom";
import ChipCustom from "../../components/ChipCustom";
import { URL_LOCAL } from "../../services/base-url";
import ROUTERS_PATHS from "../../consts/router-paths";

interface RowDataProps {
  id: number;
  patientId: string;
  doctorId: string;
  bookingType: string;
  date: string;
  service: string;
  status: string;
  [x: string]: string | number | boolean | undefined;
  [x: number]: string | number | undefined;
}

const headCells = [
  {
    label: "Tên bệnh nhân",
    sort: "patientId",
    style: { maxWidth: "25%", minWidth: "180px" },
  },
  {
    label: "Tên bác sĩ",
    sort: "doctorId",
    style: { maxWidth: "25%", minWidth: "180px" },
  },
  {
    label: "Số điện thoại",
    sort: "phone",
    style: { maxWidth: "10%", minWidth: "180px" },
  },
  {
    label: "Email",
    sort: "email",
    style: { maxWidth: "10%", minWidth: "180px" },
  },
  {
    label: "Hình thức",
    sort: "bookingType",
    style: { maxWidth: "10%", minWidth: "180px" },
  },
  {
    label: "Dịch vụ",
    sort: "service",
    style: { maxWidth: "15%", minWidth: "180px" },
  },
  {
    label: "Ngày khám",
    sort: "date",
    style: { maxWidth: "10%", minWidth: "180px" },
  },
  { label: "", style: { minWidth: "5%" } },
];

const History = () => {
  const [loadingTable, setLoadingTable] = useState<Boolean>(true);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof RowDataProps | string>("createdAt");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [userState, setUserState] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<RowDataProps | any>();
  const [filterContext, setFilterContext] = useState<any>({});
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [userDetail, setUserDetail] = useState(null);

  const { setToastInformation } = useSetToastInformationState();
  const { openConfirmModal } = useSetConfirmModalState();
  const { setLoadingScreen } = useSetLoadingScreenState();

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const open = Boolean(anchorEl);
  const menuId = open ? "simple-popover" : undefined;

  const createSortHandler = (property: keyof RowDataProps | string) => (event: React.MouseEvent<unknown>) => {
    handleRequestSort(event, property);
  };

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof RowDataProps | string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    reset({ name: "", phone: "", email: "" });
    getData({ sortBy: property, sortDirection: isAsc ? "desc" : "asc" });
  };

  const handleOpenMenuAction = (event: React.MouseEvent<HTMLButtonElement>, record: RowDataProps) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(record);
    setUserDetail(null);
  };

  const handleCloseActionMenu = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    reset({ name: "", phone: "", email: "" });
    getData({
      pageIndex: newPage,
      pageSize: rowsPerPage,
    });
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    reset({ name: "", phone: "", email: "" });
    getData({
      pageIndex: 0,
      pageSize: parseInt(event.target.value),
    });
  };

  const handleSearch = (handleCloseSearch?: () => void) => {
    setPage(0);
    handleSubmit((data) => onSubmitFilter({ ...data, sortBy: "createdAt", sortDirection: "desc", pageIndex: 0 }))();
    handleCloseSearch && handleCloseSearch();
  };

  const onSubmitFilter = (data: any) => {
    setFilterContext(data);
    getData(data);
  };

  const handleClearSearch = () => {
    reset({ name: "", phone: "", email: "" });
  };

  const handleRefresh = () => {
    reset({ name: "", phone: "", email: "" });
    getData({});
  };

  const handleOpenModal = () => {
    setUserDetail(null);
    setIsViewMode(false);
    setIsOpenModal(true);
    setSelectedItem(null);
    setTitle("Thêm mới");
  };

  const handleView = (dataDetail?: any) => {
    setAnchorEl(null);
    setIsViewMode(true);
    getUserDetail(dataDetail?.id);
    setTitle("Xem chi tiết");
  };

  const confirmBooking = async (id: any) => {
    setLoadingScreen(true);
    try {
      const dateHour = selectedItem?.timeSlot && selectedItem?.timeSlot.split("-")[1];
      const date = dateHour
        ? `${moment(selectedItem?.date).format("YYYY-MM-DD")} ${dateHour}`
        : moment(new Date()).format("YYYY-MM-DD HH:mm");
      const data = {
        status: "Approved",
        statusUpdateTime: date,
      };
      await apiService.put(`${URL_PATHS.CONFIRM_BOOKING}/${id || selectedItem?._id}`, data);
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: MESSAGE_SUCCESS.CONFIRM_BOOKING,
      });
      getData && getData({});
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setLoadingScreen(false);
    }
  };

  const getData = async (props: any) => {
    setLoadingTable(true);
    const pageSize = !!props && props.hasOwnProperty("pageSize") ? props.pageSize || 0 : rowsPerPage;
    const pageIndex = !!props && props.hasOwnProperty("pageIndex") ? props.pageIndex || 0 : page;
    const name = !!props && props.hasOwnProperty("name") ? props.name : "";
    const phone = !!props && props.hasOwnProperty("phone") ? props.phone : "";
    const email = !!props && props.hasOwnProperty("email") ? props.email : "";
    const highlightId = !!props && props.hasOwnProperty("highlightId") ? props.highlightId : null;

    const sortBy = props?.sortBy || orderBy;
    const sortOrder = props?.sortDirection || order;

    const params = {
      Page: pageIndex + 1,
      PageSize: pageSize,
      Sorts: (sortOrder === "desc" ? "-" : "") + sortBy,
    };

    const filters = { unEncoded: { name: name, phone: phone, email: email } };
    try {
      const data: any = await apiService.getFilter(URL_PATHS.GET_HISTORY, params, filters);
      setTotalCount(data?.totalUsers);
      setUserState(data?.data);
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setLoadingTable(false);
    }
  };

  const getUserDetail = async (id: string | number) => {
    window.open(URL_LOCAL + ROUTERS_PATHS.DETAIL_HISTORY.replace(":id", selectedItem._id + ""));
  };

  useEffect(() => {
    getData({});
  }, []);

  return (
    <Page className={styles.root} title="Lịch sử khám bệnh" isActive>
      <Grid container style={{ marginBottom: "20px" }}>
        <Grid item xs={10}>
          <Box>
            <SearchPopover contentWidth="40rem" onFilter={handleSearch} onClear={handleClearSearch}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box style={{ marginTop: 2 }}>
                    <LabelCustom title="Họ và tên" />
                    <Controller
                      control={control}
                      name="name"
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <TextFieldCustom
                          name={name}
                          ref={ref}
                          value={value}
                          onChange={onChange}
                          placeholder="Nhập họ và tên"
                          type="text"
                        />
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box style={{ marginTop: 2 }}>
                    <LabelCustom title="Email" />
                    <Controller
                      control={control}
                      name="email"
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <TextFieldCustom
                          name={name}
                          ref={ref}
                          value={value}
                          onChange={onChange}
                          placeholder="Nhập email"
                          type="text"
                        />
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box style={{ marginTop: 2 }}>
                    <LabelCustom title="Số điện thoại" />
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <TextFieldCustom
                          name={name}
                          ref={ref}
                          value={value}
                          onChange={onChange}
                          placeholder="Nhập số điện thoại"
                          type="text"
                        />
                      )}
                    />
                  </Box>
                </Grid>
              </Grid>
            </SearchPopover>
            <ButtonIconCustom
              className="mg-l-10"
              tooltipTitle="Làm mới"
              type="refresh"
              color="lightgreen"
              onClick={handleRefresh}
            />
          </Box>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ maxHeight: window.innerHeight - 250 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headCells.map((header: any, index: number) => {
                if (header.label === "Ngày tạo") {
                  return (
                    <StickyTableCell key={index} style={header.style} className={clsx("background-table-header")}>
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
              <LoadingTableRow colSpan={8} />
            ) : userState && userState.length > 0 ? (
              <>
                {userState.map((data: any, index: number) => {
                  let statusContext = getRowStatus(data.status);
                  return (
                    <TableRow
                      key={index}
                      hover
                      className={clsx(styles.stickyTableRow, { "highlight-row": data?.isHighlight })}
                    >
                      <TableCell>{data?.name}</TableCell>
                      <TableCell>{data?.doctorId?.name}</TableCell>
                      <TableCell>{data.phone}</TableCell>
                      <TableCell>{data.email}</TableCell>
                      <TableCell>{data.bookingType}</TableCell>
                      <TableCell className="">{data?.service?.name}</TableCell>
                      <TableCell>{moment(data.createdAt).format(FORMAT_DATE)}</TableCell>
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
              <NoDataTableRow colSpan={8} />
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
          <MenuListActions actionView={handleView} actionNote={handleView} />
        </Popover>
      </IF>
    </Page>
  );
};

export default History;
