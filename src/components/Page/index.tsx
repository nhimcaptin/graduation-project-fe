import React, { forwardRef } from "react";
import { Box, Typography } from "@mui/material";
import { Helmet } from "react-helmet";

import styles from "./styles.module.scss";
import clsx from "clsx";
import ELEMENT_ID from "../../consts/element";

const Page = forwardRef((props: any, ref: any) => {
  const { children, title = "", isActive, ...rest } = props;
  const breadCrumbs =  document.getElementById(ELEMENT_ID.BREADCRUMB_CONTAINER);
  breadCrumbs && (breadCrumbs.innerHTML = title);
  return (
    <div ref={ref} {...rest}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box
        height={window.innerHeight - 182}
        className={clsx({ [styles.box]: isActive })}
      >
        {children}
      </Box>
    </div>
  );
});

export default Page;
