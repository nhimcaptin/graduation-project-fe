import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const LoadingIcon = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress color="success" />
    </div>
  );
};

export default LoadingIcon;
