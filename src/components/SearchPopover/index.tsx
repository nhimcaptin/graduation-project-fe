import { Box, IconButton, Popover, Typography } from '@mui/material';
import React, { useState } from 'react';
import styles from './styles.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonIconCustom } from '../ButtonIconCustom';
import COLORS from '../../consts/colors';
import ButtonCustom from '../ButtonCustom';

interface SearchPopoverProps {
    onFilter?: (handleCloseSearch?: () => void) => void;
    onClear?: () => void;
    isLoading?: boolean;
    children: React.ReactNode;
    contentWidth?: string | number;
    isDisabledClearBtn?: boolean;
    isDisabledSearchBtn?: boolean;
    watchDateValues?: any;
}

const SearchPopover = (props: SearchPopoverProps) => {
    const {
        onFilter,
        onClear,
        isLoading,
        children,
        contentWidth,
        isDisabledClearBtn = false,
        isDisabledSearchBtn = false,
        watchDateValues
    } = props;
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | HTMLSpanElement | null>(null);
    const [disableEventButton, setDisableEventButton] = useState<boolean>(false);
    const open = Boolean(anchorEl);
    const popoverId = open ? 'simple-popover' : undefined;

    const handleOpenSearch = (event: React.MouseEvent<HTMLButtonElement | HTMLSpanElement>) => {
        setAnchorEl(event.currentTarget);
        setDisableEventButton(true);
    };

    const handleCloseSearch = () => {
        setAnchorEl(null);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onFilter && onFilter();
        if (watchDateValues && watchDateValues?.fromDate && watchDateValues?.toDate) {
            handleCloseSearch();
        }
        if(!watchDateValues) {
          handleCloseSearch();
        }
        setTimeout(() => {
            setDisableEventButton(false);
        }, 1000);
    };
    return (
        <>
            <ButtonIconCustom
                tooltipTitle="Tìm kiếm"
                onSpanClick={handleOpenSearch}
                type="search"
                color="darkgreen"
                isLoading={isLoading}
            />
            <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseSearch}
                style={{ backgroundColor: COLORS.BACKGROUND_LOADING }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
            >
                <Box width={contentWidth || '20rem'} padding="15px" className={styles.headerSearch}>
                    <Typography variant={'h5'}>Tìm kiếm</Typography>
                    <IconButton aria-label="close" size="small" onClick={isLoading ? undefined : handleCloseSearch}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box width={contentWidth || '20rem'} padding="15px">
                    <form onSubmit={handleSearch}>
                        {children}
                        <Box textAlign="right" paddingTop="15px">
                            <ButtonCustom
                                disabled={isLoading || isDisabledClearBtn}
                                className={styles.buttonClear}
                                color="white"
                                // startIcon={<ClearIcon />}
                                onClick={isLoading ? undefined : onClear}
                            >
                                Xóa
                            </ButtonCustom>
                            <ButtonCustom
                                id="button-submit"
                                type="submit"
                                disabled={isLoading || isDisabledSearchBtn}
                                onClick={handleSearch}
                                className={styles.buttonSearch}
                                color="yellow"
                                // startIcon={isLoading ? <CircularProgress color="inherit" size="20px" /> : <SearchIcon />}
                            >
                                Tìm kiếm
                            </ButtonCustom>
                        </Box>
                    </form>
                </Box>
            </Popover>
        </>
    );
};

export default SearchPopover;
