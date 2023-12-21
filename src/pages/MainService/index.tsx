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
  TableSortLabel,
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
import { MESSAGES_CONFIRM, MESSAGE_SUCCESS } from "../../consts/messages";
import { STATUS_TOAST, statusOptionsActive } from "../../consts/statusCode";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";
import { useSetConfirmModalState } from "../../redux/store/confirmModal";
import { useSetLoadingScreenState } from "../../redux/store/loadingScreen";
import apiService from "../../services/api-services";
import URL_PATHS from "../../services/url-path";
import { FORMAT_DATE, labelDisplayedRows, rowsPerPageOptions } from "../../utils";
import { handleErrorMessage } from "../../utils/errorMessage";
import { Order } from "../../utils/sortTable";
import AddMainService from "./components/AddMainService";
import styles from "./styles.module.scss";
import { usePermissionHook } from "../../hook/usePermission";
import ChipCustom from "../../components/ChipCustom";

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
    label: "Tên danh mục",
    sort: "name",
    style: { width: "55%" },
  },
  {
    label: "Trạng thái",
    style: { width: "20%" },
  },
  {
    label: "Ngày tạo",
    sort: "createdAt",
    style: { width: "20%" },
  },
  { label: "", style: { minWidth: "5%" } },
];

const MainService = (props: any) => {
  const { screenName } = props;
  const { hasCreate, hasUpdate, hasDelete } = usePermissionHook(screenName);

  const [loadingTable, setLoadingTable] = useState<Boolean>(true);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof RowDataProps | string>("createdAt");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [mainServiceState, setMainServiceState] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<RowDataProps | any>();
  const [filterContext, setFilterContext] = useState<any>({});
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [mainServiceDetail, setMainServiceDetail] = useState(null);

  const { setToastInformation } = useSetToastInformationState();
  const { openConfirmModal } = useSetConfirmModalState();
  const { setLoadingScreen } = useSetLoadingScreenState();

  const searchResults = useMemo(() => {
    let results = [
      {
        label: "Tên danh mục",
        value: filterContext?.name || "",
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
    getData({ sortBy: property, sortDirection: isAsc ? "desc" : "asc" });
  };

  const handleOpenMenuAction = (event: React.MouseEvent<HTMLButtonElement>, record: RowDataProps) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(record);
    setMainServiceDetail(null);
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
    reset({ name: "", phone: "", email: "" });
  };

  const handleRefresh = () => {
    setPage(0);
    setRowsPerPage(10);
    reset({ name: "", phone: "", email: "" });
    getData({ name: "", phone: "", email: "", pageIndex: 0, pageSize: 10 });
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
    setSelectedItem(null);
    setMainServiceDetail(null);
    setIsViewMode(false);
    setTitle("Thêm mới");
  };

  const handleCancel = () => {
    setIsOpenModal(false);
    setSelectedItem(null);
  };

  const handleView = (dataDetail?: any) => {
    setAnchorEl(null);
    setIsViewMode(true);
    getDetail(dataDetail?.id);
    setTitle("Xem chi tiết");
  };

  const handleEdit = (dataDetail?: any) => {
    setAnchorEl(null);
    setIsViewMode(false);
    getDetail(dataDetail?.id);
    setTitle("Chỉnh sửa");
  };

  const handleDelete = () => {
    setAnchorEl(null);
    openConfirmModal({
      isOpen: true,
      title: "Xóa",
      message: MESSAGES_CONFIRM.DeleteMainService,
      cancelBtnLabel: "Hủy",
      okBtnLabel: "Xóa",
      isDeleteConfirm: true,
      onOk: () => onDelete(),
    });
  };

  const onDelete = async () => {
    setLoadingScreen(true);
    try {
      await apiService.delete(`${URL_PATHS.DELETE_MAIN_SERVICE}/${selectedItem?._id}`);
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: MESSAGE_SUCCESS.DELETE_MAIN_SERVICE,
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

  const handleActionActive = (isCheck?: any) => {
    if (isCheck) {
      handleActive();
    } else {
      handleInActive();
    }
  };

  const handleActive = async () => {
    setLoadingScreen(true);
    try {
      await apiService.get(`${URL_PATHS.ACTIVE_MAIN_SERVICE}/${selectedItem?._id}`);
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: MESSAGE_SUCCESS.UPDATE_STATUS_SERVICE,
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

  const handleInActive = async () => {
    setLoadingScreen(true);
    try {
      await apiService.get(`${URL_PATHS.INACTIVE_MAIN_SERVICE}/${selectedItem?._id}`);
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: MESSAGE_SUCCESS.UPDATE_STATUS_SERVICE,
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
    const name = !!props && props.hasOwnProperty("name") ? props.name : filterContext?.name;
    const highlightId = !!props && props.hasOwnProperty("highlightId") ? props.highlightId : null;

    const sortBy = props?.sortBy || orderBy;
    const sortOrder = props?.sortDirection || order;

    const params = {
      Page: pageIndex + 1,
      PageSize: pageSize,
      Sorts: (sortOrder === "desc" ? "-" : "") + sortBy,
    };

    const filters = { unEncoded: { name: name } };
    try {
      const data: any = await apiService.getFilter(URL_PATHS.GET_LIST_MAIN_SERVICE, params, filters);
      const _item = (data?.mainServices || []).map((x: any) => {
        return {
          ...x,
          isHighlight: x._id === highlightId,
        };
      });
      setTotalCount(data?.totalUsers);
      setMainServiceState(_item);
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setLoadingTable(false);
      setFilterContext({ name });
    }
  };

  const getDetail = async (id: string | number) => {
    setLoadingScreen(true);
    try {
      const data: any = await apiService.getFilter(`${URL_PATHS.GET_DETAIL_MAIN_SERVICE}/${id || selectedItem?._id}`);
      setMainServiceDetail(data);
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

  useEffect(() => {
    getData({});
  }, []);

  console.log("selectedItem", selectedItem);

  return (
    <Page className={styles.root} title="Danh mục" isActive>
      <Grid container style={{ marginBottom: "20px" }}>
        <Grid item xs={10}>
          <Box>
            <SearchPopover contentWidth="20rem" onFilter={handleSearch} onClear={handleClearSearch}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box style={{ marginTop: 2 }}>
                    <LabelCustom title="Tên danh mục" />
                    <Controller
                      control={control}
                      name="name"
                      render={({ field: { onChange, onBlur, value, ref, name } }) => (
                        <TextFieldCustom
                          name={name}
                          ref={ref}
                          value={value}
                          onChange={onChange}
                          placeholder="Nhập tên danh mục"
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
              <LoadingTableRow colSpan={6} />
            ) : mainServiceState && mainServiceState.length > 0 ? (
              <>
                {mainServiceState.map((data: any, index: number) => {
                  const statusContext: any = statusOptionsActive.find((_xs: any) => _xs.value === data?.status);
                  return (
                    <TableRow
                      key={index}
                      hover
                      className={clsx(styles.stickyTableRow, { "highlight-row": data?.isHighlight })}
                    >
                      <TableCell>{data.name}</TableCell>
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
            actionEdit={hasUpdate ? () => handleEdit() : undefined}
            actionDelete={hasDelete ? () => handleDelete() : undefined}
            actionActive={hasUpdate && selectedItem?.status == "Inactive" ? () => handleActionActive(true) : undefined}
            actionInActive={hasUpdate && selectedItem?.status == "Active" ? () => handleActionActive() : undefined}
          />
        </Popover>
      </IF>

      {isOpenModal && (
        <AddMainService
          isOpen={isOpenModal}
          title={title}
          onCancel={handleCancel}
          isEdit={!isViewMode}
          dataDetail={mainServiceDetail}
          getData={getData}
        />
      )}
    </Page>
  );
};

export default MainService;
