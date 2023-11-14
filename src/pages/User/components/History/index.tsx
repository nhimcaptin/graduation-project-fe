import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import clsx from "clsx";
import moment from "moment";
import React, { useEffect, useState } from "react";
import LabelCustom from "../../../../components/LabelCustom";
import LoadingTableRow from "../../../../components/LoadingTableRow";
import NoDataTableRow from "../../../../components/NoDataTableRow";
import { StickyTableCell } from "../../../../components/StickyTableCell";
import DISPLAY_TEXTS from "../../../../consts/display-texts";
import { STATUS_TOAST } from "../../../../consts/statusCode";
import { useSetToastInformationState } from "../../../../redux/store/ToastMessage";
import apiService from "../../../../services/api-services";
import URL_PATHS from "../../../../services/url-path";
import { FORMAT_DATE, labelDisplayedRows, rowsPerPageOptions } from "../../../../utils";
import { handleErrorMessage } from "../../../../utils/errorMessage";
import CrudModal from "../../../../components/CrudModal";

const headCells = [
  {
    label: "Tên bệnh nhân",
    style: { maxWidth: "25%", minWidth: "180px" },
  },
  {
    label: "Tên bác sĩ",
    style: { maxWidth: "25%", minWidth: "180px" },
  },
  {
    label: "Hình thức",
    style: { maxWidth: "10%", minWidth: "180px" },
  },
  {
    label: "Dịch vụ",
    style: { maxWidth: "15%", minWidth: "180px" },
  },
  {
    label: "Ngày khám",
    style: { maxWidth: "10%", minWidth: "180px" },
  },
];

const History = (props: any) => {
  const { isOpen, title, onCancel, dataDetail } = props;
  const [totalCount, setTotalCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);
  const [page, setPage] = useState(0);
  const [dataTable, setDataTable] = useState<any>([]);
  const [loadingTable, setLoadingTable] = useState<any>(false);

  const { setToastInformation } = useSetToastInformationState();

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    getListTable({
      pageIndex: newPage,
      pageSize: rowsPerPage,
    });
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
    getListTable({
      pageIndex: 0,
      pageSize: parseInt(event.target.value),
    });
  };

  const getListTable = async (props: any) => {
    setLoadingTable(true);
    const pageSize = !!props && props.hasOwnProperty("pageSize") ? props.pageSize || 0 : rowsPerPage;
    const pageIndex = !!props && props.hasOwnProperty("pageIndex") ? props.pageIndex || 0 : page;

    const params = {
      Page: pageIndex + 1,
      PageSize: pageSize,
    };

    const filters = { equals: { patientId: dataDetail } };
    try {
      const data: any = await apiService.getFilter(URL_PATHS.GET_HISTORY, params, filters);
      setTotalCount(data?.totalUsers);
      setDataTable(data?.data);
    } catch (error: any) {
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: handleErrorMessage(error),
      });
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    getListTable({});
  }, []);

  return (
    <CrudModal
      isOpen={isOpen}
      formTitle={title}
      handleSave={undefined}
      handleClose={onCancel}
      cancelBtnLabel="Hủy"
      saveBtnLabel="Lưu"
      dialogProps={{
        fullWidth: true,
        maxWidth: "lg",
      }}
    >
      <Grid container item xs={12} >
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ maxHeight: window.innerHeight - 300 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {headCells.map((header: any, index: number) => {
                    if (header.label === "Ngày tạo") {
                      return (
                        <StickyTableCell key={index} style={header.style} className={clsx("background-table-header")}>
                          {header.sort ? <TableSortLabel>{header.label}</TableSortLabel> : header.label}
                        </StickyTableCell>
                      );
                    }
                    return (
                      <TableCell
                        key={index}
                        style={header.style}
                        sx={{ fontWeight: "bold", marginTop: "5%" }}
                        className={clsx("background-table-header")}
                      >
                        {header.sort ? <TableSortLabel>{header.label}</TableSortLabel> : header.label}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingTable ? (
                  <LoadingTableRow colSpan={6} />
                ) : dataTable && dataTable.length > 0 ? (
                  <>
                    {dataTable.map((data: any, index: number) => {
                      return (
                        <TableRow key={index} hover className={clsx({ "highlight-row": data?.isHighlight })}>
                          <TableCell>{data?.name}</TableCell>
                          <TableCell>{data?.doctorId?.name}</TableCell>
                          <TableCell>{data.bookingType}</TableCell>
                          <TableCell className="">{data?.service?.name}</TableCell>
                          <TableCell>{moment(data.createdAt).format(FORMAT_DATE)}</TableCell>
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
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </CrudModal>
  );
};

export default History;
