import { Checkbox, FormControlLabel, SxProps, Typography } from '@mui/material';
import { SwitchBaseProps } from '@mui/material/internal/SwitchBase';
import { makeStyles } from '@mui/styles';
import React from 'react';
import COLORS from '../../consts/colors';

interface SelectBoxType {
    value?: any;
    onChange?: any;
    label: string | React.ReactNode;
    disabled?: boolean;
    sx?: SxProps;
    sxCheckbox?: SxProps;
    sxLabel?: SxProps;
    className?: string;
    inputProps?: SwitchBaseProps['inputProps'];
    disableRipple?: SwitchBaseProps['disableRipple'];
}

const useStyles = makeStyles(() => ({
    label: {
        fontSize: '14px !important',
        lineHeight: '17px !important',
        color: `${COLORS.TEXT} !important`
    }
}));

const SelectBox = (props: SelectBoxType) => {
    const { value, onChange, label, disabled, sx, sxLabel, className, inputProps, disableRipple, sxCheckbox } = props;
    const classes = useStyles();

    return (
        <>
            <FormControlLabel
                className={className}
                disabled={disabled}
                checked={value}
                control={
                    <Checkbox
                        size="small"
                        inputProps={inputProps}
                        color="success"
                        disableRipple={disableRipple}
                        sx={sxCheckbox}
                    />
                }
                label={
                    <Typography onMouseDown={(e) => e.preventDefault()} className={classes.label} sx={sxLabel}>
                        {label}
                    </Typography>
                }
                onChange={(_e, selected) => {
                    onChange(selected);
                }}
                sx={sx}
            />
        </>
    );
};

export default SelectBox;
