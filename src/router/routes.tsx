import ROUTERS_PATHS from "../consts/router-paths";
import React, { Suspense, Fragment, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SlashScreen from "../components/SlashScreen";

import AuthGuard from "../components/AuthGuard";
import GuestGuard from "../components/GuestGuard";
import MainLayout from "../layouts/MainLayout";

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
}

export const renderRoutes = (routes: IRoutesState[]) => (
  <Suspense fallback={<SlashScreen />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;
        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Component />}</Layout>
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
    component: lazy(() => import("../pages/Login")),
  },
  {
    path: ROUTERS_PATHS.ALL,
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        path: ROUTERS_PATHS.DASHBOARD,
        component: lazy(() => import("../pages/Dashboard")),
      },
      {
        path: ROUTERS_PATHS.CUSTOMER,
        component: lazy(() => import("../pages/User")),
      },
      {
        path: ROUTERS_PATHS.USER,
        component: lazy(() => import("../pages/Staff")),
      },
      {
<<<<<<< HEAD
        path: ROUTERS_PATHS.MY_PROFILE,
        component: lazy(() => import("../pages/MyProfile")),
=======
        path: ROUTERS_PATHS.Role,
        component: lazy(() => import("../pages/Role")),
>>>>>>> 55e54dbd6866d17fb5fbdd819840a0ec1c8fda87
      },
      {
        path: "*",
        component: () => <Navigate to={ROUTERS_PATHS.DASHBOARD} replace />,
      },
    ],
  },
];

export default routes;
