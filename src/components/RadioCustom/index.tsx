import { Radio, FormControlLabel, Typography } from '@mui/material';
interface RadioType {
  className?: any;
  sx?: any;
  value?: any;
  label: any;
  disabled?: boolean;
}

const RadioCustom = (props: RadioType) => {
  const { value, label, disabled, ...prop } = props;
  return (
    <>
      <FormControlLabel
        disabled={disabled}
        value={value}
        control={<Radio color="warning" />}
        label={<Typography sx={{ color: '#614C4C', fontSize: '14px' }}>{label}</Typography>}
        {...prop}
      />
    </>
  );
};

export default RadioCustom;
