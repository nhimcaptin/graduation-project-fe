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
    key: "ROLE",
    title: "Quản lý vai trò",
    icon: Icons.RoleUser,
    href: ROUTERS_PATHS.Role,
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
  {
    key: "BOOKING",
    title: "Đặt Lịch",
    icon: Icons.Schedule,
    href: ROUTERS_PATHS.BOOKING,
    role: [Role.Administrator, Role.Doctor, Role.Receptionist],
    subMenu: [],
  },
  {
    key: "QUEUE_LIST",
    title: "Danh sách khám",
    icon: Icons.List,
    href: ROUTERS_PATHS.QUEUE_LIST,
    role: [Role.Administrator, Role.Doctor, Role.Receptionist],
    subMenu: [],
  },
  {
    key: "GET_LIST_HISTORY",
    title: "Lịch sử đặt lịch",
    icon: Icons.History,
    href: ROUTERS_PATHS.GET_LIST_HISTORY,
    role: [Role.Administrator, Role.Doctor, Role.Receptionist],
    subMenu: [],
  },
];
