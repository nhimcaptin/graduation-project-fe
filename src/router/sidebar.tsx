import Icons from "../consts/Icons";
import ROUTERS_PATHS from "../consts/router-paths";

const Role = {
  Receptionist: "Receptionist",
  Administrator: "Administrator",
  Doctor: "Doctor",
};

export const sidebar = [
  {
    key: "DASHBOARD",
    title: "Trang chủ",
    icon: Icons.Dashboard,
    href: ROUTERS_PATHS.DASHBOARD,
    role: [Role.Administrator, Role.Doctor, Role.Receptionist],
    subMenu: [],
  },
  {
    key: "CUSTOMER",
    title: "Khách hàng",
    icon: Icons.Customer,
    href: ROUTERS_PATHS.CUSTOMER,
    role: [Role.Administrator, Role.Doctor, Role.Receptionist],
    subMenu: [],
  },
  {
    key: "USER",
    title: "Nhân viên",
    icon: Icons.User,
    href: ROUTERS_PATHS.USER,
    role: [Role.Administrator, Role.Doctor, Role.Receptionist],
    subMenu: [],
  },
];
