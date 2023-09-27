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
    icon: Icons.IconUser,
    href: ROUTERS_PATHS.DASHBOARD,
    role: [Role.Administrator, Role.Doctor, Role.Receptionist],
    subMenu: [],
  },
  {
    key: "DASHBOARD",
    title: "Trang chủ",
    icon: Icons.IconUser,
    href: ROUTERS_PATHS.DASHBOARD,
    role: [Role.Administrator, Role.Doctor, Role.Receptionist],
    subMenu: [],
  },
];
