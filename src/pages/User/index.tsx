import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
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
  TableSortLabel
} from "@mui/material";
import { Box } from "@mui/system";
import { visuallyHidden } from "@mui/utils";
import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ButtonIconCustom } from "../../components/ButtonIconCustom";
import IF from "../../components/IF";
import LabelCustom from "../../components/LabelCustom";
import LoadingTableRow from "../../components/LoadingTableRow";
import MenuListActions from "../../components/MenuListActions";
import NoDataTableRow from "../../components/NoDataTableRow";
import Page from "../../components/Page";
import SearchPopover from "../../components/SearchPopover";
import SearchResult from "../../components/SearchResult";
import { StickyTableCell } from "../../components/StickyTableCell";
import TextFieldCustom from "../../components/TextFieldCustom";
import DISPLAY_TEXTS from "../../consts/display-texts";
import { MESSAGES_CONFIRM, MESSAGE_ERROR, MESSAGE_SUCCESS } from "../../consts/messages";
import { STATUS_TOAST } from "../../consts/statusCode";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";
import { useSetConfirmModalState } from "../../redux/store/confirmModal";
import { useSetLoadingScreenState } from "../../redux/store/loadingScreen";
import apiService from "../../services/api-services";
import URL_PATHS from "../../services/url-path";
import { FORMAT_DATE, labelDisplayedRows, rowsPerPageOptions } from "../../utils";
import { handleErrorMessage } from "../../utils/errorMessage";
import { RegExpEmail } from "../../utils/regExp";
import { Order } from "../../utils/sortTable";
import AddUser from "./components/AddUser";
import History from "./components/History";
import styles from "./styles.module.scss";

interface RowDataProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
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
    sort: "createdAt",
    style: { maxWidth: "20%", minWidth: "180px" },
  },
  { label: "", style: { minWidth: "5%" } },
];

const User = () => {
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
  const [isOpenModalHistory, setIsOpenModalHistory] = useState<boolean>(false);
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
    setFilterContext({})
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
    setFilterContext({})
    getData({
      pageIndex: newPage,
      pageSize: rowsPerPage,
    });
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    reset({ name: "", phone: "", email: "" });
    setFilterContext({})
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
    reset({ name: "", phone: "", email: "" });
  };

  const handleRefresh = () => {
    reset({ name: "", phone: "", email: "" });
    setFilterContext({})
    getData({});
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
    setIsOpenModalHistory(false);
    setSelectedItem(null);
    setUserDetail(null);
    setTitle("Thêm mới");
  };

  const handleCancel = () => {
    setIsOpenModal(false);
    setIsOpenModalHistory(false);
    setSelectedItem(null);
  };

  const handleView = (dataDetail?: any) => {
    setAnchorEl(null);
    setIsViewMode(true);
    getUserDetail(dataDetail?.id);
    setTitle("Xem chi tiết");
  };

  const handleEdit = (dataDetail?: any) => {
    setAnchorEl(null);
    setIsViewMode(false);
    getUserDetail(dataDetail?.id);
    setTitle("Chỉnh sửa");
  };

  const handleDelete = () => {
    setAnchorEl(null);
    openConfirmModal({
      isOpen: true,
      title: "Xóa",
      message: MESSAGES_CONFIRM.DeleteUser,
      cancelBtnLabel: "Hủy",
      okBtnLabel: "Xóa",
      isDeleteConfirm: true,
      onOk: () => onDelete(),
    });
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

  const handleHistory = (dataDetail?: any) => {
    setAnchorEl(null);
    setIsViewMode(false);
    setIsOpenModal(false);
    setIsOpenModalHistory(true);
    setTitle("Lịch sử");
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

    const filters = { unEncoded: { name: name, phone: phone, email: email }, equals: { isAdmin: "false" } };
    try {
      const data: any = await apiService.getFilter(URL_PATHS.GET_USER, params, filters);
      const _item = (data?.data || []).map((x: any) => {
        return {
          ...x,
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
    }
  };

  const getUserDetail = async (id: string | number) => {
    setLoadingScreen(true);
    try {
      const data: any = await apiService.getFilter(`${URL_PATHS.DETAIL_USER}/${id || selectedItem?._id}`);
      setUserDetail(data);
      setIsOpenModal(true);
      setIsOpenModalHistory(false);
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
    getData({});
  }, []);

  return (
    <Page className={styles.root} title="Khách hàng" isActive>
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
            <ButtonIconCustom
              className="mg-l-10"
              tooltipTitle="Thêm mới"
              type="add"
              color="darkgreen"
              onClick={handleOpenModal}
            />
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
              <LoadingTableRow colSpan={6} />
            ) : userState && userState.length > 0 ? (
              <>
                {userState.map((data: any, index: number) => {
                  return (
                    <TableRow
                      key={index}
                      hover
                      className={clsx(styles.stickyTableRow, { "highlight-row": data?.isHighlight })}
                    >
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.email}</TableCell>
                      <TableCell>{data.phone}</TableCell>
                      <TableCell className="">{data.address}</TableCell>
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
            actionView={handleView}
            actionEdit={handleEdit}
            actionDelete={handleDelete}
            actionHistory={handleHistory}
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
      {isOpenModalHistory && (
        <History isOpen={isOpenModalHistory} title={title} onCancel={handleCancel} dataDetail={selectedItem?._id} />
      )}
    </Page>
  );
};

export default User;
