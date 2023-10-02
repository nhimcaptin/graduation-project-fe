import { TableCell, TableRow, Box } from '@mui/material';
import React from 'react';

interface NoDataTableRowProps {
  colSpan: number;
  displayText?: string;
  tableContainerRef?: any;
}

const NoDataTableRow = (props: NoDataTableRowProps) => {
  const { colSpan, tableContainerRef, displayText } = props;
  const noDataContent = React.useMemo(() => {
    if (tableContainerRef?.current?.offsetWidth) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
          <Box
            component="span"
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              top: 88,
              left: tableContainerRef?.current?.offsetWidth / 2 - 35
            }}
          >
            {displayText || 'Không có dữ liệu.'}
          </Box>
        </Box>
      );
    } else {
      return <>{displayText || 'Không có dữ liệu.'}</>;
    }
    // eslint-disable-next-line
  }, [tableContainerRef?.current]);
  return (
    <TableRow hover>
      <TableCell colSpan={colSpan} sx={{ textAlign: 'center' }}>
        {noDataContent}
      </TableCell>
    </TableRow>
  );
};

export default NoDataTableRow;
