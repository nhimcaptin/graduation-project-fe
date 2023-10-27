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
import { Link, useNavigate } from "react-router-dom";
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
import ROUTERS_PATHS from "../../consts/router-paths";
import { URL_LOCAL } from "../../services/base-url";

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
    label: "STT",
    style: { maxWidth: "10%", minWidth: "50px" },
  },
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
    label: "Trạng thái",
    sort: "status",
    style: { maxWidth: "10%", minWidth: "80px" },
  },
  { label: "", style: { minWidth: "5%" } },
];

const headCellsAction = [
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
    label: "Hình thức",
    sort: "bookingType",
    style: { maxWidth: "10%", minWidth: "180px" },
  },
  {
    label: "Dịch vụ",
    sort: "service",
    style: { maxWidth: "15%", minWidth: "180px" },
  },
];

const BookingDoctor = () => {
  const [loadingTable, setLoadingTable] = useState<Boolean>(true);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof RowDataProps | string>("createdAt");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableState, setUserState] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<RowDataProps | any>();
  const [dataComeCheck, setDataComeCheck] = useState([])

  const { setToastInformation } = useSetToastInformationState();
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

  const onDelete = async () => {
    setLoadingScreen(true);
    try {
      await apiService.delete(`${URL_PATHS.CREATE_USER}/${selectedItem?._id}`);
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: MESSAGE_SUCCESS.DELETE_USER,
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
      const data: any = await apiService.getFilter(URL_PATHS.GET_BOOKING, params, filters);
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

  const handleComeCheck = () => {
    setAnchorEl(null);
    const _dataCome = tableState.filter((item: any) => item._id === selectedItem._id);
    const _tableState = tableState.filter((item: any) => item._id !== selectedItem._id);
    setDataComeCheck(_dataCome);
    setUserState(_tableState);
    window.open(URL_LOCAL + ROUTERS_PATHS.QUEUE_DETAIL.replace(':id', selectedItem._id + ''))
  }


  useEffect(() => {
    getData({});
  }, []);

  return (
    <Page className={styles.root} title="Danh sách đặt lịch" isActive>
      <Grid container item xs={12} sx={{ marginTop: "15px" }}>
        <LabelCustom title="Bệnh nhân vào khám" sx={{ fontSize: "18px !important" }} />
        <TableContainer component={Paper} sx={{ maxHeight: window.innerHeight - 250 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headCellsAction.map((header: any, index: number) => {
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
              {false ? (
                <LoadingTableRow colSpan={7} />
              ) : dataComeCheck && dataComeCheck.length > 0 ? (
                <>
                  {dataComeCheck.map((data: any, index: number) => {
                    let statusContext = getRowStatus(data.status);
                    return (
                      <TableRow
                        key={index}
                        hover
                        className={clsx(styles.stickyTableRow, { "highlight-row": data?.isHighlight })}
                      >
                        <TableCell>{data.patientName}</TableCell>
                        <TableCell>{data.doctorName}</TableCell>
                        <TableCell>{data.bookingType}</TableCell>
                        <TableCell className="">{data.service}</TableCell>
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
      </Grid>
      <Grid container item xs={12} sx={{ marginTop: "15px" }}>
        <LabelCustom title="Danh sách thứ tự" sx={{ fontSize: "18px !important" }} />
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
              <LoadingTableRow colSpan={7} />
            ) : tableState && tableState.length > 0 ? (
              <>
                {tableState.map((data: any, index: number) => {
                  let statusContext = getRowStatus(data.status);
                  return (
                    <TableRow
                      key={index}
                      hover
                      className={clsx(styles.stickyTableRow, { "highlight-row": data?.isHighlight })}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{data.patientName}</TableCell>
                      <TableCell>{data.doctorName}</TableCell>
                      <TableCell>{data.bookingType}</TableCell>
                      <TableCell className="">{data.service}</TableCell>
                      <TableCell className="">
                        <ChipCustom label={statusContext.label} chipType={statusContext.chipType} />
                      </TableCell>
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
          <MenuListActions
            actionComeCheck={handleComeCheck}
          />
        </Popover>
      </IF>
    </Page>
  );
};

export default BookingDoctor;