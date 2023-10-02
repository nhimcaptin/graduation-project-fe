import { TableCell, TableRow, CircularProgress, Box } from '@mui/material';
import React from 'react';

interface LoadingTableRowProps {
  colSpan: number;
  tableContainerRef?: any;
}

const LoadingTableRow = (props: LoadingTableRowProps) => {
  const { colSpan, tableContainerRef } = props;
  const loadingContent = React.useMemo(() => {
    if (tableContainerRef?.current?.offsetWidth) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
          <CircularProgress
            color="success"
            sx={{
              position: 'absolute',
              top: 75,
              left: tableContainerRef?.current?.offsetWidth / 2 - 35
            }}
          />
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress color="success" />
        </Box>
      );
    }
    // eslint-disable-next-line
  }, [tableContainerRef?.current?.offsetWidth]);
  return (
    <TableRow hover>
      <TableCell colSpan={colSpan}>{loadingContent}</TableCell>
    </TableRow>
  );
};

export default LoadingTableRow;
