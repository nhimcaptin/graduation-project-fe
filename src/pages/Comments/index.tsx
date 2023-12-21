import React, { useEffect, useMemo, useState } from "react";
import Page from "../../components/Page";
import styles from "./styles.module.scss";
import {
  Grid,
  IconButton,
  Paper,
  Popover,
  Rating,
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
  labelDisplayedRows,
  rowsPerPageOptions,
} from "../../utils";
import DISPLAY_TEXTS from "../../consts/display-texts";
import apiService from "../../services/api-services";
import URL_PATHS from "../../services/url-path";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";
import { STATUS_TOAST } from "../../consts/statusCode";
import { handleErrorMessage } from "../../utils/errorMessage";
import moment from "moment";
import AddUser from "./components/AddEditComment";
import { useSetConfirmModalState } from "../../redux/store/confirmModal";
import {
  MESSAGES_CONFIRM,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} from "../../consts/messages";
import IF from "../../components/IF";
import { useSetLoadingScreenState } from "../../redux/store/loadingScreen";
import TextFieldCustom from "../../components/TextFieldCustom";
import ReactSelect from "../../components/ReactSelectView";
import { RegExpEmail, RegPhoneNumber } from "../../utils/regExp";
import { usePermissionHook } from "../../hook/usePermission";
import SearchResult from "../../components/SearchResult";
import { BASE_URL } from "../../services/base-url";
import AddEditComment from "./components/AddEditComment";

interface RowDataProps {
  id: number;
  name: string;
  comment: string;
  rate: number | string;
  role: number | string;
  email: string;
  address: string;
  createdAt: string;
  [x: string]: string | number | boolean | undefined;
  [x: number]: string | number | undefined;
}

const headCells = [
  {
    label: "Bình luận",
    sort: "comment",
    style: { maxWidth: "30%", minWidth: "180px" },
  },
  {
    label: "Người bình luận",
    sort: "user",
    style: { maxWidth: "30%", minWidth: "180px" },
  },
  {
    label: "Đánh giá",
    sort: "rate",
    style: { maxWidth: "30%", minWidth: "180px" },
  },
  {
    label: "Bác sĩ",
    sort: "role",
    style: { maxWidth: "30%", minWidth: "180px" },
  },
  {
    label: "Ngày tạo",
    sort: "createdAt",
    style: { maxWidth: "20%", minWidth: "180px" },
  },
  { label: "", style: { minWidth: "5%" } },
];

const Comment = (props: any) => {
  const { screenName } = props;
  const { hasCreate, hasUpdate, hasDelete } = usePermissionHook(screenName);

  const [loadingTable, setLoadingTable] = useState<Boolean>(true);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof RowDataProps | string>(
    "createdAt"
  );
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
        label: "Bình luận",
        value: filterContext?.comment || "",
      },
      {
        label: "Tên bác sĩ",
        value: getMultiLabel(filterContext?.role, "label") || "",
      },
    ];
    return results;
  }, [filterContext]);
  //   console.log(filterContext);
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
      comment: "",
      rate: "",
      email: "",
      role: "",
      doctorId: "",
    },
  });

  const open = Boolean(anchorEl);
  const menuId = open ? "simple-popover" : undefined;

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
    setUserDetail(null);
  };

  const handleCloseActionMenu = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    getData({
      pageIndex: newPage,
      pageSize: rowsPerPage,
    });
  };

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    getData({
      pageIndex: 0,
      pageSize: parseInt(event.target.value),
    });
  };

  const handleSearch = (handleCloseSearch?: () => void) => {

    handleSubmit((data) =>
      onSubmitFilter(
        { ...data, sortBy: "createdAt", sortDirection: "desc", pageIndex: 0 },
        handleCloseSearch
      )
    )();
  };

  const onSubmitFilter = (data: any, handleCloseSearch?: () => void) => {
    // console.log(data);
    
    setPage(0);
    handleCloseSearch && handleCloseSearch();
    setFilterContext(data);
    getData(data);
  };

  const handleClearSearch = () => {
    reset({ comment: "", role: "" });
  };

  const handleRefresh = () => {
    setPage(0);
    setRowsPerPage(10);
    reset({ comment: "", role: "" });
    getData({ comment: "", role: "", pageIndex: 0, pageSize: 10 });
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
    setSelectedItem(null);
    setUserDetail(null);
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
      message: MESSAGES_CONFIRM.DeleteSatff,
      cancelBtnLabel: "Hủy",
      okBtnLabel: "Xóa",
      isDeleteConfirm: true,
      onOk: () => onDelete(),
    });
  };

  const onDelete = async () => {
    setLoadingScreen(true);
    try {
      await apiService.delete(
        `${URL_PATHS.DELETE_COMMENT}/${selectedItem?._id}`
      );
      setToastInformation({
        status: STATUS_TOAST.SUCCESS,
        message: MESSAGE_SUCCESS.DELETE_COMMENT,
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
    const pageSize =
      !!props && props.hasOwnProperty("pageSize")
        ? props.pageSize || 0
        : rowsPerPage;
    const pageIndex =
      !!props && props.hasOwnProperty("pageIndex")
        ? props.pageIndex || 0
        : page;
    const comment =
      !!props && props.hasOwnProperty("comment")
        ? props.comment
        : filterContext?.comment || "";
    const role =
      !!props && props.hasOwnProperty("role")
        ? props.role
        : filterContext?.role || "";

    const highlightId =
      !!props && props.hasOwnProperty("highlightId") ? props.highlightId : null;

    const sortBy = props?.sortBy || orderBy;
    const sortOrder = props?.sortDirection || order;
    // console.log(pageSize,pageIndex,sortBy,sortOrder);
    const params = {
      Page: pageIndex + 1,
      PageSize: pageSize,
      Sorts: (sortOrder === "desc" ? "-" : "") + sortBy,
    };

    const filters = {
      unEncoded: { comment: comment },
      equals: {
        isAdmin: "true",
        role: role ? getMultiFilter(role, "name") : "",
      },
    };
    // console.log(filters);
    try {
      const data: any = await apiService.getFilter(
        URL_PATHS.GET_LIST_COMMENT,
        params,
        filters
      ); 
      const _item = await Promise.all(
        (data?.data || []).map(async (x: any) => {
          const doctorName = await apiService.get(
            `${BASE_URL}${URL_PATHS.GET_ONE_DOCTOR}/${x?.doctorId}`
          );
          const userName = await apiService.get(
            `${BASE_URL}${URL_PATHS.DETAIL_USER}/${x?.userId}`
          );
          return {
            ...x,
            doctorName: doctorName,
            userName: userName,
            isHighlight: x._id === highlightId,
          };
        })
      );
    
      
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
        comment,
        role,
      });
    }
  };

  const getUserDetail = async (id: string | number) => {
    setLoadingScreen(true);
    try {
      const data: any = await apiService.getFilter(
        `${URL_PATHS.DETAIL_USER}/${id || selectedItem?._id}`
      );
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

  const getRoleOptions = async (
    searchText: string,
    page: number,
    perPage: number
  ) => {
    const params = {
      page,
      perPage,
    };

    const filters = {
      comment: searchText,
    };
    try {
      const res: any = await apiService.getFilter(
        URL_PATHS.GET_DOCTOR,
        params,
        filters
      );
      const resultItems: any[] = res?.doctors;

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
  //   console.log(userState);

  useEffect(() => {
    getData({});
  }, []);


  return (
    <Page className={styles.root} title="Bình luận" isActive>
      <Grid container style={{ marginBottom: "20px" }}>
        <Grid item xs={10}>
          <Box>
            <SearchPopover
              contentWidth="40rem"
              onFilter={handleSearch}
              onClear={handleClearSearch}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box style={{ marginTop: 2 }}>
                    <LabelCustom title="Bình luận" />
                    <Controller
                      control={control}
                      name="comment"
                      render={({
                        field: { onChange, onBlur, value, ref, name },
                      }) => (
                        <TextFieldCustom
                          name={name}
                          ref={ref}
                          value={value}
                          onChange={onChange}
                          placeholder="Tìm bình luận"
                          type="text"
                        />
                      )}
                    />
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box style={{ marginTop: 2 }}>
                    <LabelCustom title="Tên bác sĩ" />
                    <Controller
                      control={control}
                      name="role"
                      render={({
                        field: { onChange, onBlur, value, ref, name },
                      }) => (
                        <ReactSelect
                          isClearable
                          getOptions={getRoleOptions}
                          value={value}
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          fieldName={name}
                          maxMenuHeight={120}
                          placeholder="Chọn bác sĩ"
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
        {/* <Grid item xs={2}>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
            height="100%"
          >
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
        </Grid> */}
      </Grid>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: window.innerHeight - tableDiff }}
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
            {loadingTable ? (
              <LoadingTableRow colSpan={7} />
            ) : userState && userState.length > 0 ? (
              <>
                {userState.map((data: any, index: number) => {
                  return (
                    <TableRow
                      key={index}
                      hover
                      className={clsx(styles.stickyTableRow, {
                        "highlight-row": data?.isHighlight,
                      })}
                    >
                      <TableCell>{data.comment}</TableCell>
                      <TableCell>{data.userName.name}</TableCell>
                      <TableCell>
                        <Rating
                          name="read-only"
                          value={data?.rate}
                          readOnly
                          size="small"
                        />
                      </TableCell>

                      <TableCell>{data.doctorName.name}</TableCell>
                      <TableCell>
                        {moment(data.createdAt).format(FORMAT_DATE)}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="more"
                          onClick={(e) => handleOpenMenuAction(e, data)}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <NoDataTableRow colSpan={7} />
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
            // actionView={handleView}
            // actionEdit={hasUpdate ? () => handleEdit() : undefined}
            actionDelete={hasDelete ? () => handleDelete() : undefined}
          />
        </Popover>
      </IF>

      {isOpenModal && (
        <AddEditComment
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

export default Comment;
