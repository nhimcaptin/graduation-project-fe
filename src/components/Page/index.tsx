import React, { forwardRef } from "react";
import { Box, Typography } from "@mui/material";
import { Helmet } from "react-helmet";

import styles from "./styles.module.scss";
import clsx from "clsx";

const Page = forwardRef((props: any, ref: any) => {
  const { children, title = "", isActive, ...rest } = props;
  return (
    <div ref={ref} {...rest}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box
        height={window.innerHeight - 182}
        className={clsx({ [styles.box]: isActive })}
      >
        {isActive && (
          <Typography
            variant="h5"
            component="h5"
            className={styles.titleHeader}
            gutterBottom
          >
            {title}
          </Typography>
        )}
        {children}
      </Box>
    </div>
  );
});

export default Page;
