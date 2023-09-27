import React, { forwardRef } from "react";
import { Box } from "@mui/material";
import { Helmet } from "react-helmet";

import styles from "./styles.module.scss";

const Page = forwardRef((props: any, ref: any) => {
  const { children, title = "", ...rest } = props;
  return (
    <div ref={ref} {...rest}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box className={styles.box}>{children}</Box>
    </div>
  );
});

export default Page;
