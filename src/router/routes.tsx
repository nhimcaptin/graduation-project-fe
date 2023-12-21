import ROUTERS_PATHS from "../consts/router-paths";
import React, { Suspense, Fragment, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SlashScreen from "../components/SlashScreen";

import AuthGuard from "../components/AuthGuard";
import GuestGuard from "../components/GuestGuard";
import MainLayout from "../layouts/MainLayout";
import Permission from "../components/Permission";
import { SCREEN_ROLE_CODE } from "../consts/permission";

interface IAuthGuardProps {
  children: React.ReactNode;
}

interface IGuestGuardProps {
  children: React.ReactNode;
}

interface IRoutesState {
  exact?: boolean;
  path?: string;
  guard?: React.FC<IAuthGuardProps | IGuestGuardProps>;
  layout?: any;
  component?: any;
  routes?: IRoutesState[];
  role?: string | string[];
}

export const renderRoutes = (routes: IRoutesState[]) => (
  <Suspense fallback={<SlashScreen />}>
    <Routes>
      {routes.map((route: any, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;
        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Permission role={route.role}>
                  <Layout>{route.routes ? renderRoutes(route.routes) : <Component screenName={route.role} />}</Layout>
                </Permission>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes: IRoutesState[] = [
  {
    guard: GuestGuard,
    path: ROUTERS_PATHS.LOGIN,
    component: lazy(() => import("../pages/Login")),
  },
  {
    guard: GuestGuard,
    path: ROUTERS_PATHS.FORGOT_PASSWORD,
    component: lazy(() => import("../pages/ForgotPassword")),
  },
  {
    guard: GuestGuard,
    path: ROUTERS_PATHS.TEST,
    component: lazy(() => import("../pages/Test")),
  },
  {
    guard: GuestGuard,
    path: ROUTERS_PATHS.REST_PASSWORD,
    component: lazy(() => import("../pages/RestPassword")),
  },
  {
    path: ROUTERS_PATHS.ALL,
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        path: ROUTERS_PATHS.DASHBOARD,
        component: lazy(() => import("../pages/Dashboard")),
        role: [SCREEN_ROLE_CODE.Dashboard],
      },
      {
        path: ROUTERS_PATHS.PROFILE,
        component: lazy(() => import("../pages/Profile")),
        role: [SCREEN_ROLE_CODE.Dashboard],
      },
      {
        path: ROUTERS_PATHS.CUSTOMER,
        component: lazy(() => import("../pages/User")),
        role: [SCREEN_ROLE_CODE.User],
      },
      {
        path: ROUTERS_PATHS.USER,
        component: lazy(() => import("../pages/Staff")),
        role: [SCREEN_ROLE_CODE.Staff],
      },
      {
        path: ROUTERS_PATHS.Role,
        component: lazy(() => import("../pages/Role")),
        role: [SCREEN_ROLE_CODE.Role],
      },
      {
        path: ROUTERS_PATHS.BOOKING,
        component: lazy(() => import("../pages/Booking")),
        role: [SCREEN_ROLE_CODE.Booking],
      },
      {
        path: ROUTERS_PATHS.QUEUE_LIST,
        component: lazy(() => import("../pages/BookingDoctor")),
        role: [SCREEN_ROLE_CODE.QueueList],
      },
      {
        path: ROUTERS_PATHS.QUEUE_DETAIL,
        component: lazy(() => import("../pages/ViewBookingDoctor")),
      },
      {
        path: ROUTERS_PATHS.MEDICAL_EXAMINATION_NOTES,
        component: lazy(() => import("../pages/History")),
        role: [SCREEN_ROLE_CODE.MedicalExaminationNotes],
      },
      {
        path: ROUTERS_PATHS.DETAIL_HISTORY,
        component: lazy(() => import("../pages/ReceptionistNote")),
      },
      {
        path: ROUTERS_PATHS.MAIN_SERVICES,
        component: lazy(() => import("../pages/MainService")),
        role: [SCREEN_ROLE_CODE.MainService],
      },
      {
        path: ROUTERS_PATHS.SUB_SERVICES,
        component: lazy(() => import("../pages/SubServices")),
        role: [SCREEN_ROLE_CODE.SubServices],
      },
      {
        path: ROUTERS_PATHS.VOUCHER,
        component: lazy(() => import("../pages/Voucher")),
        role: [SCREEN_ROLE_CODE.SubServices],
      },    {
        path: ROUTERS_PATHS.NEW,
        component: lazy(() => import("../pages/New")),
        role: [SCREEN_ROLE_CODE.SubServices],
      },
      {
        path: ROUTERS_PATHS.DENTAL_KNOWLEDGE,
        component: lazy(() => import("../pages/DentalKnowledge")),
        role: [SCREEN_ROLE_CODE.SubServices],
      },
      {
        path: ROUTERS_PATHS.COMMENT,
        component: lazy(() => import("../pages/Comments")),
        role: [SCREEN_ROLE_CODE.SubServices],
      },
      {
        path: "*",
        component: () => <Navigate to={ROUTERS_PATHS.DASHBOARD} replace />,
      },
    ],
  },
];

export default routes;
