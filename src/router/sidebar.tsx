import { SCREEN_ROLE_CODE } from "../consts/permission";
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
    role: [SCREEN_ROLE_CODE.Dashboard],
    subMenu: [],
  },
  {
    key: "ROLE",
    title: "Quản lý vai trò",
    icon: Icons.RoleUser,
    href: ROUTERS_PATHS.Role,
    role: [SCREEN_ROLE_CODE.Role],
    subMenu: [],
  },
  {
    key: "CUSTOMER",
    title: "Khách hàng",
    icon: Icons.Customer,
    href: ROUTERS_PATHS.CUSTOMER,
    role: [SCREEN_ROLE_CODE.User],
    subMenu: [],
  },
  {
    key: "USER",
    title: "Nhân viên",
    icon: Icons.User,
    href: ROUTERS_PATHS.USER,
    role: [SCREEN_ROLE_CODE.Staff],
    subMenu: [],
  },
  {
    key: "BOOKING",
    title: "Đặt Lịch",
    icon: Icons.Schedule,
    href: ROUTERS_PATHS.BOOKING,
    role: [SCREEN_ROLE_CODE.Booking],
    subMenu: [],
  },
  {
    key: "QUEUE_LIST",
    title: "Danh sách khám",
    icon: Icons.List,
    href: ROUTERS_PATHS.QUEUE_LIST,
    role: [SCREEN_ROLE_CODE.QueueList],
    subMenu: [],
  },
  {
    key: "MEDICAL_EXAMINATION_NOTES",
    title: "Ghi phiếu khám bệnh",
    icon: Icons.Note,
    href: ROUTERS_PATHS.MEDICAL_EXAMINATION_NOTES,
    role: [SCREEN_ROLE_CODE.MedicalExaminationNotes],
    subMenu: [],
  },
  {
    key: "MAIN_SERVICES",
    title: "Danh mục dịch vụ",
    icon: Icons.MainService,
    href: ROUTERS_PATHS.MAIN_SERVICES,
    role: [SCREEN_ROLE_CODE.MainService],
    subMenu: [],
  },
  {
    key: "SUB_SERVICES",
    title: "Dịch vụ",
    icon: Icons.SubService,
    href: ROUTERS_PATHS.SUB_SERVICES,
    role: [SCREEN_ROLE_CODE.SubServices],
    subMenu: [],
  },
  {
    key: "VOUCHER",
    title: "Ưu đãi",
    icon: Icons.Voucher,
    href: ROUTERS_PATHS.VOUCHER,
    role: [SCREEN_ROLE_CODE.SubServices],
    subMenu: [],
  },
];
