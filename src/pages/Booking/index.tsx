import React, { useEffect, useMemo, useState } from "react";
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
import {
  FORMAT_DATE,
  getMultiFilter,
  getMultiLabel,
  getRowStatus,
  labelDisplayedRows,
  rowsPerPageOptions,
} from "../../utils";
import DISPLAY_TEXTS from "../../consts/display-texts";
import apiService from "../../services/api-services";
import URL_PATHS from "../../services/url-path";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";
import { STATUS_TOAST, statusOptions, statusOptionsPayment } from "../../consts/statusCode";
import { handleErrorMessage } from "../../utils/errorMessage";
import moment from "moment";
import { useSetConfirmModalState } from "../../redux/store/confirmModal";
import { MESSAGES_CONFIRM, MESSAGE_ERROR, MESSAGE_SUCCESS } from "../../consts/messages";
import IF from "../../components/IF";
import { useSetLoadingScreenState } from "../../redux/store/loadingScreen";
import TextFieldCustom from "../../components/TextFieldCustom";
import AddUser from "./components/AddNew";
import ChipCustom from "../../components/ChipCustom";
import ReactSelect from "../../components/ReactSelectView";
import { RegExpEmail } from "../../utils/regExp";
import { usePermissionHook } from "../../hook/usePermission";
import SearchResult from "../../components/SearchResult";
import { useSelector } from "react-redux";

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
    label: "Kiểu đặt",
    sort: "setType",
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
    label: "Ngày giờ đặt lịch",
    sort: "date",
    style: { maxWidth: "10%", minWidth: "180px" },
  },
  {
    label: "Trạng thái thanh toán",
    sort: "status",
    style: { maxWidth: "20%", minWidth: "200px" },
  },
  {
    label: "Trạng thái",
    sort: "status",
    style: { maxWidth: "20%", minWidth: "180px" },
  },
  { label: "", style: { minWidth: "5%" } },
];

const Booking = (props: any) => {
  const { screenName } = props;
  const { hasCreate, hasUpdate, hasDelete } = usePermissionHook(screenName);

  const { currentUser } = useSelector((state: any) => state.currentUser);

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

  const searchResults = useMemo(() => {
    let results = [
      {
        label: "Tên bệnh nhân",
        value: filterContext?.name || "",
      },
      {
        label: "Email",
        value: filterContext?.email || "",
      },
      {
        label: "Số điện thoại",
        value: filterContext?.phone || "",
      },
      {
        label: "Dịch vụ",
        value: getMultiLabel(filterContext.service, "label"),
      },
      {
        label: "Trạng thái",
        value: getMultiLabel(filterContext.status, "label"),
      },
    ];
    return results;
  }, [filterContext]);

  const isShowResult = searchResults.some((result) => !!result.value);
  const tableDiff = isShowResult ? 280 : 250;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      numberPhoneCustomer: "",
      emailCustomer: "",
      service: "",
      status: true ? [statusOptions[0], statusOptions[1]] : "",
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
    getData({
      pageIndex: newPage,
      pageSize: rowsPerPage,
    });
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    getData({
      pageIndex: 0,
      pageSize: parseInt(event.target.value),
    });
  };

  const handleSearch = (handleCloseSearch?: () => void) => {
    handleSubmit((data) =>
      onSubmitFilter({ ...data, sortBy: "createdAt", sortDirection: "desc", pageIndex: 0 }, handleCloseSearch)
    )();
  };

  const onSubmitFilter = (data: any, handleCloseSearch?: () => void) => {
    setPage(0);
    handleCloseSearch && handleCloseSearch();
    setFilterContext(data);
    getData(data);
  };

  const handleClearSearch = () => {
    reset({ name: "", numberPhoneCustomer: "", emailCustomer: "", service: "", status: "" });
  };

  const handleRefresh = () => {
    setOrderBy("createdAt");
    setPage(0);
    setRowsPerPage(10);
    reset({
      name: "",
      numberPhoneCustomer: "",
      emailCustomer: "",
      service: "",
      status: [statusOptions[0], statusOptions[1]],
    });
    getData({
      name: "",
      numberPhoneCustomer: "",
      emailCustomer: "",
      service: "",
      status: [statusOptions[0], statusOptions[1]],
      pageIndex: 0,
      pageSize: 10,
    });
  };

  const handleOpenModal = () => {
    setUserDetail(null);
    setIsViewMode(false);
    setIsOpenModal(true);
    setSelectedItem(null);
    setTitle("Thêm mới");
  };

  const handleCancel = () => {
    setIsOpenModal(false);
    setSelectedItem(null);
  };

  const handleView = (dataDetail?: any) => {
    setAnchorEl(null);
    setIsViewMode(true);
    getUserDetail(dataDetail?.id);
    setTitle("Xem chi tiết");
  };

  const handleConfirm = (dataDetail?: any) => {
    setAnchorEl(null);
    setIsViewMode(true);
    confirmBooking(dataDetail?.id);
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
      getData && getData({ ...filterContext, highlightId: selectedItem?._id });
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
    const name = !!props && props.hasOwnProperty("name") ? props.name : filterContext?.name || "";
    const numberPhoneCustomer =
      !!props && props.hasOwnProperty("numberPhoneCustomer")
        ? props.numberPhoneCustomer
        : filterContext?.numberPhoneCustomer || "";
    const emailCustomer =
      !!props && props.hasOwnProperty("emailCustomer") ? props.emailCustomer : filterContext?.emailCustomer || "";
    const status = !!props && props.hasOwnProperty("status") ? props.status : filterContext?.status || "";
    const service = !!props && props.hasOwnProperty("service") ? props.service : filterContext?.service || "";
    const highlightId = !!props && props.hasOwnProperty("highlightId") ? props.highlightId : null;

    const sortBy = props?.sortBy || orderBy;
    const sortOrder = props?.sortDirection || order;

    const params = {
      Page: pageIndex + 1,
      PageSize: pageSize,
      Sorts: (sortOrder === "desc" ? "-" : "") + sortBy,
    };

    const filters = {
      unEncoded: { name: name, numberPhoneCustomer: numberPhoneCustomer, emailCustomer: emailCustomer },
      equals: {
        status: status ? getMultiFilter(status, "value") : "",
        service: service ? getMultiFilter(service, "value") : "",
      },
    };
    try {
      const data: any = await apiService.getFilter(URL_PATHS.GET_BOOKING, params, filters);
      const _item = (data?.data || []).map((x: any) => {
        const service = x?.service.map((y: any) => y?.name).join(", ");
        return {
          ...x,
          service,
          isHighlight: x._id === highlightId,
        };
      });
      setTotalCount(data?.totalUsers);
      setUserState(_item);
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setLoadingTable(false);
      setFilterContext({
        name,
        numberPhoneCustomer,
        emailCustomer,
        status,
        service,
      });
    }
  };

  const getUserDetail = async (id: string | number) => {
    setLoadingScreen(true);
    try {
      const data: any = await apiService.getFilter(`${URL_PATHS.DETAIL_BOOKING}/${id || selectedItem?._id}`);
      setUserDetail(data);
      setIsOpenModal(true);
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setLoadingScreen(false);
    }
  };

  const getMainServiceOptions = async (searchText: string, page: number, perPage: number) => {
    const params = {
      page,
      perPage,
    };

    const filters = {
      name: searchText,
    };
    try {
      const res: any = await await apiService.getFilter(URL_PATHS.GET_LIST_MAIN_SERVICE, params, filters);
      const resultItems: any[] = res?.mainServices;
      if (resultItems.length >= 0) {
        const items: any[] = resultItems.map((item) => {
          const result = {
            ...item,
            label: item?.name || "",
            value: item?._id || "",
          };
          return result;
        });
        return {
          options: items,
          hasMore: res?.totalUsers / perPage > page,
        };
      }
      return {
        options: [],
        hasMore: false,
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const handleDelete = () => {
    setAnchorEl(null);
    openConfirmModal({
      isOpen: true,
      title: "Hủy đặt lịch",
      message: MESSAGES_CONFIRM.CancelBooking,
      cancelBtnLabel: "Hủy",
      okBtnLabel: "Hủy đặt lịch",
      isDeleteConfirm: true,
      onOk: () => onDelete(),
    });
  };

  const onDelete = async () => {
    setLoadingScreen(true);
    try {
      const _data = {
        id: selectedItem?._id,
        userId: currentUser?._id,
      };
      const res: any = await apiService.post("api/refund", _data);
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: MESSAGE_SUCCESS.CANCEL_BOOKING,
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

  useEffect(() => {
    getData({ status: [statusOptions[0], statusOptions[1]] });
    setFilterContext({ status: [statusOptions[0], statusOptions[1]] });
  }, []);

  return (
    <Page className={styles.root} title="Danh sách đặt lịch" isActive>
      <Grid container style={{ marginBottom: "20px" }}>
        <Grid item xs={10}>
          <Box>
            <SearchPopover contentWidth="40rem" onFilter={handleSearch} onClear={handleClearSearch}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box style={{ marginTop: 2 }}>
                    <LabelCustom title="Tên bệnh nhân" />
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
                      name="emailCustomer"
                      rules={{
                        validate: (value: any) => {
                          const result = RegExpEmail(value);
                          return !value || result || MESSAGE_ERROR.RegExpEmail;
                        },
                      }}
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <TextFieldCustom
                          name={name}
                          ref={ref}
                          value={value}
                          onChange={onChange}
                          placeholder="Nhập email"
                          type="text"
                          errorMessage={errors?.emailCustomer?.message}
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
                      name="numberPhoneCustomer"
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
                <Grid item xs={6}>
                  <Box style={{ marginTop: 2 }}>
                    <LabelCustom title="Dịch vụ" />
                    <Controller
                      control={control}
                      name="service"
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <ReactSelect
                          isClearable
                          getOptions={getMainServiceOptions}
                          value={value}
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          fieldName={name}
                          maxMenuHeight={120}
                          placeholder="Chọn dịch vụ"
                          inputRef={ref}
                          isMulti
                          isValidationFailed
                        />
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box style={{ marginTop: 2 }}>
                    <LabelCustom title="Trạng thái" />
                    <Controller
                      control={control}
                      name="status"
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <ReactSelect
                          isClearable
                          options={statusOptions}
                          value={value}
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          fieldName={name}
                          maxMenuHeight={120}
                          placeholder="Chọn trạng thái"
                          inputRef={ref}
                          isMulti
                          isValidationFailed
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
            <SearchResult results={searchResults} />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box display="flex" justifyContent="flex-end" alignItems="flex-end" height="100%">
            {hasCreate && (
              <ButtonIconCustom
                className="mg-l-10"
                tooltipTitle="Thêm mới"
                type="add"
                color="darkgreen"
                onClick={handleOpenModal}
              />
            )}
          </Box>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ maxHeight: window.innerHeight - tableDiff }}>
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
                  let statusPayment = getRowStatus(data?.statusPaymentOrder, statusOptionsPayment);
                  return (
                    <TableRow
                      key={index}
                      hover
                      className={clsx(styles.stickyTableRow, { "highlight-row": data?.isHighlight })}
                    >
                      <TableCell>{data?.setType ? data?.nameCustomer : data?.patientId?.name}</TableCell>
                      <TableCell>{data?.doctorId?.name}</TableCell>
                      <TableCell>
                        {(data.setType == "Migrant" && "Khách vãng lai") ||
                          (data.setType == "ReserveFor" && "Đặt hộ cho người thân") ||
                          (data.setType == "ReExamination" && "Tái khám") ||
                          (!data.setType && "Đặt cho mình") ||
                          ""}
                      </TableCell>
                      <TableCell>{data.bookingType}</TableCell>
                      <TableCell className="">{data?.service}</TableCell>
                      <TableCell>
                        {data?.timeTypeId?.timeSlot
                          ? `${data?.timeTypeId?.timeSlot} | ${moment(data.date).format(FORMAT_DATE)}`
                          : ""}
                      </TableCell>
                      <TableCell className="">
                        <ChipCustom label={statusPayment.label} chipType={statusPayment.chipType} />
                      </TableCell>
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
          <MenuListActions
            actionView={handleView}
            actionConfirm={selectedItem?.status == "Waiting" && hasUpdate ? () => handleConfirm() : undefined}
            actionCancel={
              selectedItem?.status != "Cancel" && hasUpdate && moment(new Date()).isBefore(selectedItem?.date, "day")
                ? () => handleDelete()
                : undefined
            }
          />
        </Popover>
      </IF>

      {isOpenModal && (
        <AddUser
          isOpen={isOpenModal}
          title={title}
          onCancel={handleCancel}
          isEdit={!isViewMode}
          dataDetail={userDetail}
          getData={getData}
        />
      )}
    </Page>
  );
};

export default Booking;
