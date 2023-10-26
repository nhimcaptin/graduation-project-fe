import EventIcon from '@mui/icons-material/Event';
import { Box, Button, DialogActions, Popover, SxProps } from '@mui/material';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import moment from 'moment';
import React, { useState } from 'react';
import TextFieldCustom from '../TextFieldCustom';

interface MyActionBarProps {
    onAccept: Function;
    onCancel: Function;
    onClear: Function;
    handleClose: Function;
    idDisabledBtn: boolean;
}

const MyActionBar = ({ onAccept, onCancel, onClear, handleClose, idDisabledBtn }: MyActionBarProps) => {
    return (
        <DialogActions>
            <Button
                disabled={idDisabledBtn}
                onClick={(e) => {
                    onClear(e);
                }}
            >
                Xóa
            </Button>
            <Button
                onClick={(e) => {
                    onCancel(e);
                    handleClose();
                }}
            >
                Hủy
            </Button>
            <Button
                disabled={idDisabledBtn}
                onClick={(e) => {
                    onAccept(e);
                    handleClose();
                }}
            >
                Xác nhận
            </Button>
        </DialogActions>
    );
};

interface DateTimePickerCustomProps {
    onChange: Function;
    value: any;
    inputProps?: any;
    staticDateTimePickerProps?: any;
    inputFormat: string;
    disableFuture?: boolean;
    minDate?: Date;
    maxDate?: Date;
    sx?: SxProps;
    ref?: any;
    transformOrigin?: any;
    anchorOriginRight?: boolean;
}

const DateTimePickerCustom = React.forwardRef((props: DateTimePickerCustomProps, ref?: React.Ref<any>) => {
    const {
        onChange,
        value,
        inputProps = {},
        staticDateTimePickerProps = {},
        inputFormat,
        disableFuture,
        minDate,
        maxDate,
        sx,
        transformOrigin,
        anchorOriginRight
    } = props;
    const [valueDate, setValueDate] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <>
            <TextFieldCustom
                {...inputProps}
                inputProps={{ readOnly: true }}
                value={value || valueDate ? moment(value || valueDate).format(inputFormat || 'DD/MM/YYYY HH:mm') : ''}
                disabled={!!staticDateTimePickerProps?.disabled}
                size="small"
                fullWidth
                placeholder={'dd/mm/yyyy - hh:mm'}
                onClick={(e) => {
                    if (staticDateTimePickerProps.disabled) return;
                    inputProps.onClick && inputProps.onClick(e);
                    handleClick(e);
                }}
                InputProps={{
                    endAdornment: <EventIcon sx={{ cursor: 'pointer' }} />
                }}
                ref={ref}
                sx={sx}
            />
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: transformOrigin ? 'top' : 'bottom',
                    horizontal: anchorOriginRight ? 'right' : 'left'
                }}
                {...transformOrigin}
            >
                <Box
                    position="relative"
                    sx={{
                        '& .PrivatePickersFadeTransitionGroup-root': {
                            '& div': {
                                fontSize: '14px'
                            }
                        },
                        '& .MuiPickersCalendarHeader-labelContainer': {
                            letterSpacing: 'initial'
                        },
                        '& .MuiPickersCalendarHeader-label': {
                            fontWeight: '400'
                        }
                    }}
                >
                    <StaticDateTimePicker
                        showToolbar={false}
                        disableFuture={disableFuture}
                        minDate={minDate}
                        maxDate={maxDate}
                        components={{
                            ActionBar: (actionProps: any) => (
                                <MyActionBar
                                    {...actionProps}
                                    idDisabledBtn={!value && !valueDate}
                                    handleClose={handleClose}
                                />
                            )
                        }}
                        componentsProps={{
                            actionBar: { actions: ['clear', 'cancel', 'accept'] }
                        }}
                        {...staticDateTimePickerProps}
                        toolbarTitle="Chọn ngày"
                        dayOfWeekFormatter={(day: any) => {
                            return `${day}`;
                        }}
                        renderInput={(params: any) => (
                            <TextFieldCustom {...params} size="small" fullWidth color="success" />
                        )}
                        onChange={onChange || setValueDate}
                        // onAccept={handleClose}
                        value={value || valueDate}
                    />
                </Box>
            </Popover>
        </>
    );
});

export default DateTimePickerCustom;
