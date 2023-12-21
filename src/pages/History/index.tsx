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
import { IStatusType, STATUS_CHIP, STATUS_TOAST } from "../../consts/statusCode";
import { handleErrorMessage } from "../../utils/errorMessage";
import moment from "moment";
import { useSetConfirmModalState } from "../../redux/store/confirmModal";
import { MESSAGES_CONFIRM, MESSAGE_ERROR, MESSAGE_SUCCESS } from "../../consts/messages";
import IF from "../../components/IF";
import { useSetLoadingScreenState } from "../../redux/store/loadingScreen";
import TextFieldCustom from "../../components/TextFieldCustom";
import ChipCustom from "../../components/ChipCustom";
import { URL_LOCAL } from "../../services/base-url";
import ROUTERS_PATHS from "../../consts/router-paths";
import { RegExpEmail, RegPhoneNumber } from "../../utils/regExp";
import { usePermissionHook } from "../../hook/usePermission";
import SearchResult from "../../components/SearchResult";
import ReactSelect from "../../components/ReactSelectView";
import DateTimePickerCustom from "../../components/DateTimePickerCustom";

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

export const statusOptions: IStatusType[] = [
  {
    label: "Chờ thanh toán",
    value: "Waiting",
    chipType: STATUS_CHIP.WARNING,
  },
  {
    label: "Đã thanh toán",
    value: "Done",
    chipType: STATUS_CHIP.ACTIVE,
  },
  {
    label: "Thanh toán lỗi",
    value: "Error",
    chipType: STATUS_CHIP.INACTIVE,
  },
  {
    label: "Hoàn tiền",
    value: "Cancel",
    chipType: STATUS_CHIP.INACTIVE,
  },
];

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
    style: { maxWidth: "10%", minWidth: "100px" },
  },
  {
    label: "Dịch vụ",
    sort: "service",
    style: { maxWidth: "15%", minWidth: "180px" },
  },
  {
    label: "Trạng thái thanh toán",
    sort: "statusPayment",
    style: { maxWidth: "15%", minWidth: "180px" },
  },
  {
    label: "Ngày khám",
    sort: "date",
    style: { maxWidth: "10%", minWidth: "180px" },
  },
  { label: "", style: { minWidth: "5%" } },
];

const History = (props: any) => {
  const { screenName } = props;
  const { hasUpdate } = usePermissionHook(screenName);

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
        label: "Họ và tên",
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
        label: "Từ ngày",
        value: (filterContext?.formDate && moment(filterContext?.formDate).format("DD/MM/YYYY")) || "",
      },
      {
        label: "Đến ngày",
        value: (filterContext?.toDate && moment(filterContext?.toDate).format("DD/MM/YYYY")) || "",
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
      phone: "",
      email: "",
      service: "",
      status: "",
      formDate: new Date() || "",
      toDate: new Date() || "",
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
    reset({ name: "", phone: "", email: "", service: "", status: "", formDate: "" as any, toDate: "" as any });
  };

  const handleRefresh = () => {
    setPage(0);
    setRowsPerPage(10);
    reset({ name: "", phone: "", email: "", service: "", status: "", formDate: new Date(), toDate: new Date() });
    getData({
      name: "",
      phone: "",
      email: "",
      service: "",
      status: "",
      formDate: new Date(),
      toDate: new Date(),
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

  const handleView = (dataDetail?: any) => {
    setAnchorEl(null);
    setIsViewMode(true);
    getUserDetail(dataDetail?.id);
    setTitle("Xem chi tiết");
  };

  const getData = async (props: any) => {
    setLoadingTable(true);
    const pageSize = !!props && props.hasOwnProperty("pageSize") ? props.pageSize || 0 : rowsPerPage;
    const pageIndex = !!props && props.hasOwnProperty("pageIndex") ? props.pageIndex || 0 : page;
    const name = !!props && props.hasOwnProperty("name") ? props.name : filterContext?.name || "";
    const phone = !!props && props.hasOwnProperty("phone") ? props.phone : filterContext?.phone || "";
    const email = !!props && props.hasOwnProperty("email") ? props.email : filterContext?.email || "";
    const service = !!props && props.hasOwnProperty("service") ? props.service : filterContext?.service || "";
    const status = !!props && props.hasOwnProperty("status") ? props.status : filterContext?.status || "";
    const formDate = !!props && props.hasOwnProperty("formDate") ? props.formDate : filterContext?.formDate || "";
    const toDate = !!props && props.hasOwnProperty("toDate") ? props.toDate : filterContext?.toDate || "";
    const highlightId = !!props && props.hasOwnProperty("highlightId") ? props.highlightId : null;

    const sortBy = props?.sortBy || orderBy;
    const sortOrder = props?.sortDirection || order;

    const params = {
      Page: pageIndex + 1,
      PageSize: pageSize,
      Sorts: (sortOrder === "desc" ? "-" : "") + sortBy,
    };

    const filters = {
      unEncoded: { name: name, phone: phone, email: email },
      equals: {
        formDate: formDate ? moment(formDate).format("YYYY/MM/DD") : "",
        toDate: toDate ? moment(toDate).format("YYYY/MM/DD") : "",
        statusPayment: status ? getMultiFilter(status, "value") : "",
        service: service ? getMultiFilter(service, "value") : "",
      },
    };
    try {
      const data: any = await apiService.getFilter(URL_PATHS.GET_HISTORY, params, filters);
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
      setFilterContext({ name, phone, email, service, status, formDate, toDate });
    }
  };

  const getMainServiceOptions = async (searchText: string, Page: number, PageSize: number) => {
    const params = {
      Page,
      PageSize,
    };

    const filters = {
      name: searchText,
      status: "Active",
    };
    try {
      const res: any = await await apiService.getFilter(URL_PATHS.GET_LIST_SUB_SERVICE, params, filters);
      const resultItems: any[] = res?.getSubservice;
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
          hasMore: res?.totalUsers / PageSize > Page,
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

  const getUserDetail = async (id: string | number) => {
    window.open(URL_LOCAL + ROUTERS_PATHS.DETAIL_HISTORY.replace(":id", selectedItem._id + ""));
  };

  useEffect(() => {
    getData({ formDate: new Date(), toDate: new Date() });
  }, []);

  return (
    <Page className={styles.root} title="Ghi phiếu khám bệnh" isActive>
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
                          errorMessage={errors?.email?.message}
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
                      // rules={{
                      //   validate: (value: any) => {
                      //     const result = RegPhoneNumber(value);
                      //     return !value || result || MESSAGE_ERROR.RegPhoneNumber;
                      //   },
                      // }}
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <TextFieldCustom
                          name={name}
                          ref={ref}
                          value={value}
                          onChange={onChange}
                          placeholder="Nhập số điện thoại"
                          type="text"
                          errorMessage={errors?.phone?.message}
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
                    <LabelCustom title="Từ ngày" />
                    <Controller
                      control={control}
                      name="formDate"
                      render={({ field: { value, onChange } }) => (
                        <DateTimePickerCustom
                          inputProps={{
                            errorMessage: errors?.formDate?.message,
                          }}
                          staticDateTimePickerProps={{
                            views: ["year", "day"],
                            ampm: true,
                          }}
                          value={value}
                          onChange={(e: any) => {
                            onChange(e);
                            setValue("toDate", "" as any);
                          }}
                          inputFormat="DD/MM/YYYY"
                        />
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box style={{ marginTop: 2 }}>
                    <LabelCustom title="Đến ngày" />
                    <Controller
                      control={control}
                      name="toDate"
                      render={({ field: { value, onChange } }) => (
                        <DateTimePickerCustom
                          inputProps={{
                            errorMessage: errors?.formDate?.message,
                          }}
                          staticDateTimePickerProps={{
                            minDateTime: watch("formDate"),
                            views: ["year", "day"],
                            ampm: true,
                          }}
                          value={value}
                          onChange={(e: any) => {
                            onChange(e);
                          }}
                          inputFormat="DD/MM/YYYY"
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
                  let statusContext = getRowStatus(data?.statusPayment, statusOptions);
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
                      <TableCell className="">{data?.service}</TableCell>
                      <TableCell className="">
                        <ChipCustom label={statusContext.label} chipType={statusContext.chipType} />
                      </TableCell>
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
          <MenuListActions actionView={handleView} actionNote={hasUpdate ? () => handleView() : undefined} />
        </Popover>
      </IF>
    </Page>
  );
};

export default History;
