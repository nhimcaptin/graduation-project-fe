import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { MenuItem, MenuList, Typography } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface MenuListActionsProps {
  actionEdit?: (param: any) => void | undefined;
  actionView?: (param: any) => void | undefined;
  actionDelete?: (param: any) => void | undefined;
  actionActive?: (param: any) => void | undefined;
  actionShowReview?: (param: any) => void;
  actionHideReview?: (param: any) => void;
  actionAnswerReview?: (param: any) => void | undefined;
  actionRemoveAnswerReview?: (param: any) => void | undefined;
  actionHandle?: (param: any) => void | undefined;
  actionChangePassword?: (param: any) => void | undefined;
  actionDuplicate?: (param: any) => any;
  dataSelected?: any;
}

const MenuListActions = (props: MenuListActionsProps) => {
  const {
    actionView,
    actionEdit,
    actionDelete,
    actionActive,
    dataSelected,
    actionShowReview,
    actionHideReview,
    actionAnswerReview,
    actionRemoveAnswerReview,
    actionHandle,
    actionChangePassword,
    actionDuplicate,
  } = props;

  const STATUS_VALUE = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    SUCCESS: 1,
    FAILURE: 2,
  };

  const listOptions = [
    {
      icon: <VisibilityIcon className="icon-view" />,
      label: "Xem",
      action: actionView,
    },
    {
      icon: <VisibilityIcon className="icon-view" />,
      label: dataSelected?.status === "Processed" ? "Xem" : "Xử lý",
      action: actionHandle,
    },
    {
      icon: <EditIcon className="icon-edit" />,
      label: "Chỉnh sửa",
      action: actionEdit,
    },
    {
      icon: <DeleteForeverIcon className="icon-delete" />,
      label: "Xóa",
      action: actionDelete,
    },
    {
      icon: <VpnKeyIcon className="icon-view" />,
      label: "Đổi mật khẩu",
      action: actionChangePassword,
    },
    {
      icon: <VisibilityIcon className="icon-view" />,
      label: "Hiện đánh giá",
      action: actionShowReview,
    },
    {
      icon: <VisibilityOffIcon className="icon-view" />,
      label: "Ẩn đánh giá",
      action: actionHideReview,
    },
    // {
    //   icon: null,
    //   label: 'Trả lời đánh giá',
    //   action: actionAnswerReview
    // },
    {
      icon: <DeleteForeverIcon className="icon-delete" />,
      label: "Xóa trả lời đánh giá",
      action: actionRemoveAnswerReview,
    },
    {
      icon: <ContentCopyIcon className="icon-view" />,
      label: "Sao chép",
      action: actionDuplicate,
    },
    {
      icon: dataSelected?.status === STATUS_VALUE.ACTIVE || dataSelected?.isActive ? <LockIcon /> : <LockOpenIcon />,
      label: dataSelected?.status === STATUS_VALUE.ACTIVE || dataSelected?.isActive ? "Hủy kích hoạt" : "Kích hoạt",
      action: actionActive,
    },
  ];

  return (
    <MenuList>
      {listOptions.map((option, xIndex) => {
        // eslint-disable-next-line array-callback-return
        if (!option.action) return;
        return (
          <MenuItem onClick={option.action} key={xIndex}>
            {option.icon}
            <Typography marginLeft={2} variant="inherit">
              {option.label}
            </Typography>
          </MenuItem>
        );
      })}
    </MenuList>
  );
};

export default MenuListActions;
