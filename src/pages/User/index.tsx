import React, { useState } from "react";
import Page from "../../components/Page";
import styles from "./styles.module.scss";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
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

interface RowDataProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdDate: string;
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
    sort: "createdDate",
    style: { maxWidth: "20%", minWidth: "180px" },
  },
  { label: "", style: { minWidth: "5%" } },
];

const User = () => {
  const [loadingTable, setLoadingTable] = useState<Boolean>(true);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof RowDataProps | string>("createdDate");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedItem, setSelectedItem] = useState<RowDataProps | any>();

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
  };

  const getData = (props: any) => {};

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
            {loadingTable && false ? (
              <LoadingTableRow colSpan={6} />
            ) : [] && [].length > 0 ? (
              <>
                {[].map((data: any, index: number) => {
                  return (
                    <TableRow key={index} hover className={clsx(styles.stickyTableRow)}>
                      {/* <StickyTableCell className={style.stickyTableCell}>
                        <Link to={ROUTERS_PATHS.VIEW_STORE.replace(":id", data.id + "")} className={style.linkToDetail}>
                          {data.name}
                        </Link>
                      </StickyTableCell> */}
                      <TableCell>{data.address}</TableCell>
                      <TableCell className="">{data.userCount}</TableCell>
                      <TableCell>{data.contactNumber}</TableCell>
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
    </Page>
  );
};

export default User;
