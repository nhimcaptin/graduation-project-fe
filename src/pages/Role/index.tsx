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
    style: { maxWidth: "30%", minWidth: "180px" },
  },
  {
    label: "Tên vai trò",
    sort: "roleName",
    style: { maxWidth: "30%", minWidth: "180px" },
  },
  {
    label: "Mô tả",
    sort: "description",
    style: { maxWidth: "20%", minWidth: "180px" },
  },
  { label: "", style: { minWidth: "5%" } },
];

const Role = () => {
  const [orderBy, setOrderBy] = useState<keyof RowDataProps | string>("createdAt");
  const [order, setOrder] = useState<Order>("desc");
  const [loadingTable, setLoadingTable] = useState<Boolean>(false);
  const [userState, setUserState] = useState<any>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);

  const handleOpenMenuAction = (event: React.MouseEvent<HTMLButtonElement>, record: RowDataProps) => {
    // setAnchorEl(event.currentTarget);
    // setSelectedItem(record);
    // setUserDetail(null);
  };

  const createSortHandler = (property: keyof RowDataProps | string) => (event: React.MouseEvent<unknown>) => {
    handleRequestSort(event, property);
  };
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof RowDataProps | string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    // reset({ name: "", phone: "", email: "" });
    // getData({ sortBy: property, sortDirection: isAsc ? "desc" : "asc" });
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    // setPage(newPage);
    // reset({ name: "", phone: "", email: "" });
    // getData({
    //   pageIndex: newPage,
    //   pageSize: rowsPerPage,
    // });
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // setRowsPerPage(parseInt(event.target.value));
    // setPage(0);
    // reset({ name: "", phone: "", email: "" });
    // getData({
    //   pageIndex: 0,
    //   pageSize: parseInt(event.target.value),
    // });
  };

  return (
    <Page className={styles.root} title="Khách hàng" isActive>
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
    </Page>
  );
};

export default Role;
