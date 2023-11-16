import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import clsx from "clsx";
import moment from "moment";
import { FORMAT_DATE } from "../../utils";
import LoadingTableRow from "../LoadingTableRow";
import NoDataTableRow from "../NoDataTableRow";
import LoadMore from "../LoadMore";
import { useEffect, useRef, useState } from "react";
import apiService from "../../services/api-services";
import URL_PATHS from "../../services/url-path";
import { handleErrorMessage } from "../../utils/errorMessage";
import { STATUS_TOAST } from "../../consts/statusCode";
import { useSetToastInformationState } from "../../redux/store/ToastMessage";

const headCells = [
  {
    label: "Họ và tên",
    sort: "name",
    style: { width: "30%", minWidth: "180px" },
  },
  {
    label: "Email",
    sort: "email",
    style: { width: "20%", minWidth: "180px" },
  },
  {
    label: "Số điện thoại",
    sort: "phone",
    style: { width: "20%", minWidth: "180px" },
  },
  {
    label: "Địa chỉ",
    sort: "address",
    style: { width: "20%", minWidth: "180px" },
  },
  {
    label: "Ngày tạo",
    sort: "createdAt",
    style: { width: "20%", minWidth: "180px" },
  },
];

const TableDashBoard = () => {
  const containerRef = useRef(null);
  const canLoadMore = useRef(false);
  const loadingState = useRef(false);
  const pageIndexState = useRef(1);
  const [pageIndex, setPageIndex] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const { setToastInformation } = useSetToastInformationState();

  const handleLoadMore = (entries: any) => {
    console.log("entries", entries);
    if (canLoadMore.current && !loadingState.current && entries[0].isIntersecting) {
      pageIndexState;
      setPageIndex(pageIndexState.current + 1);
    }
  };

  const onGetNewUserManagement = async () => {
    try {
      data.length > 0 && setLoading(true);
      const params = {
        Page: pageIndex,
        PageSize: 10,
      };
      const res: any = await apiService.getFilter(URL_PATHS.DASHBOARD_INFORMATION, params);
      const { listUserMost7Day, totalCount } = res;
      canLoadMore.current = pageIndex * 10 <= totalCount;
      const _item = [].concat(data, listUserMost7Day);
      setData(_item);
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pageIndexState.current = pageIndex;
    onGetNewUserManagement();
  }, [pageIndex]);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }} ref={containerRef}>
      <Table stickyHeader>
        <TableHead>
          {headCells.map((header: any, index: number) => {
            return (
              <TableCell
                key={index}
                style={header.style}
                sx={{ fontWeight: "bold", marginTop: "5%" }}
                className={clsx("background-table-header")}
              >
                {header.label}
              </TableCell>
            );
          })}
        </TableHead>
        <TableBody>
          {isLoading ? (
            <LoadingTableRow colSpan={6} />
          ) : data && data.length > 0 ? (
            <>
              {data.map((data: any, index: number) => {
                return (
                  <TableRow key={index} hover>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.email}</TableCell>
                    <TableCell>{data.phone}</TableCell>
                    <TableCell className="">{data.address}</TableCell>
                    <TableCell>{moment(data.createdAt).format(FORMAT_DATE)}</TableCell>
                  </TableRow>
                );
              })}
            </>
          ) : (
            <NoDataTableRow colSpan={6} />
          )}

          {data.length !== 0 && (
            <LoadMore
              rootMargin="0px 0px 100px 0px"
              containerElement={containerRef.current}
              loadMore={handleLoadMore}
            />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableDashBoard;
