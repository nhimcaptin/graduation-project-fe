import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import LoadingScreen from "../../components/LoadingScreen";
import { Box, Hidden, Paper } from "@mui/material";
import { useLoadingScreen } from "../../hook/useLoadingScreen";

const useStyles = makeStyles({
  mainContainer: {
    marginTop: 82,
    backgroundColor: "#E5E5E5",
    minHeight: window.innerHeight - 122,
    left: 0,
    marginLeft: 300,
    position: "relative",
    transition: "all 0.2s ease-in-out",
    paddingTop: 20,
    paddingBottom: 20,
  },
  mainContainerNav: {
    marginTop: 88,
    left: 0,
    position: "relative",
    transition: "all 0.2s ease-in-out",
    padding: 24,
  },
  paperContainer: {
    height: "95%",
    borderRadius: "unset !important",
    boxShadow: "unset !important",
  },
});

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const classes = useStyles();
  const { isLoadingScreen } = useLoadingScreen();
  const [windowHeight, setWindowHeight] = useState(window.innerHeight - 142);
  const [windowHeightNav, setWindowHeightNav] = useState(
    window.innerHeight - 177
  );
  const updateHeight = () => {
    setWindowHeight(window.innerHeight - 142);
    setWindowHeightNav(window.innerHeight - 177);
  };

  useEffect(() => {
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  });
  return (
    <>
      {/* <Header /> */}
      <div
        className={"page-wrapper " + classes.mainContainer}
        style={{ minHeight: windowHeight }}
      >
        {children}
      </div>
      {/* <SideBar /> */}

      {isLoadingScreen && <LoadingScreen />}
    </>
  );
};

export default MainLayout;
