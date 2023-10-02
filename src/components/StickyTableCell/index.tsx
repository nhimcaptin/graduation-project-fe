import { TableCell } from '@mui/material';
import { withStyles } from '@mui/styles';

//--- Sticky Table Cell
export const StickyTableCell = withStyles((theme) => {
    return {
        head: {
            backgroundColor: '#FAFAFA',
            left: 0,
            position: 'sticky',
            zIndex: '102 !important'
        },
        body: {
            backgroundColor: '#FAFAFA',
            left: 0,
            position: 'sticky',
            zIndex: '101 !important'
        }
    };
})(TableCell);
