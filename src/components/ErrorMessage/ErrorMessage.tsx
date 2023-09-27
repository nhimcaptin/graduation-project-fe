import { makeStyles } from '@mui/styles';
import React from 'react';
import { ErrorMessageProps } from 'models/ErrorMessage.model';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  txtError: {
    fontSize: '12px',
    color: '#f44336',
    textAlign: 'start',
    margin: '5px'
  }
}));

const ErrorMessage: React.FC<ErrorMessageProps | any> = (props) => {
  const classes = useStyles();
  const { children, className, ...rest } = props;
  if (!children) return null;
  return (
    <p className={clsx(classes.txtError, { [className]: !!className })} {...rest}>
      {children}
    </p>
  );
};

export default ErrorMessage;
