import { MESSAGE_ERROR } from "../const/messages.js";
import { createError } from "../middlewares/error.js";
import Action from "../models/Action.js";
import Resource from "../models/Resource.js";
import Role from "../models/Role.js";
import { getPermissions } from "../util/index.js";

export const createRole = async (req, res, next) => {
  try {
    await new Role(
      {
        roleName: "Administrator",
        description: "Người quản trị viên",
        permissions: [],
      },
      {
        roleName: "Receptionist",
        description: "Lễ tân cửa hàng",
        permissions: [],
      },
      {
        roleName: "Doctor",
        description: "Bác sĩ",
        permissions: [],
      }
    ).save();

    await new Action(
      { code: "View", name: "Xem" },
      { code: "Create", name: "Thêm" },
      { code: "Update", name: "Sửa" },
      { code: "Delete", name: "Xoá" },
      { code: "Export", name: "Xuất file" },
      { code: "LoginAdmin", name: "" }
    ).save();

    await new Resource(
      { code: "LoginAdmin", name: "Đăng nhập Admin" },
      { code: "Dashboard", name: "Doanh thu thuần" },
      { code: "User", name: "Người dùng" },
      { code: "Staff", name: "Nhân Viên" },
    ).save();

    res.status(200).send("SUCCESS");
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (req, res, next) => {
  const id = req.query.id;
  try {
    await Role.findByIdAndUpdate(id, {
      $set: {
        permissions: req?.body?.permissions,
      },
    });
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

export const getListRole = async (req, res, next) => {
  try {
    const listUser = await Role.find({});
    const data = listUser.map((x) => {
      return {
        _id: x?._id,
        roleName: x.roleName,
        description: x?.description,
      };
    });
    const totalUsers = listUser.length;
    res.status(200).json({ data, totalUsers });
  } catch (err) {
    next(err);
  }
};

export const resourceActions = async (req, res) => {
  try {
    const _resource = await Resource.find();
    const _action = await Action.find();
    const _resourceActions = _resource.map((x) => {
      const filterAction = _action.filter((y) => {
        if (y?.code === "Export") return ["User", "Staff"].includes(x?.code);
        if (y?.code !== "LoginAdmin") {
          if (x?.code === "LoginAdmin" ) return false;
          return true;
        }
        if (y?.code === "LoginAdmin") {
          if (x?.code === "LoginAdmin" ) return true;
          return false;
        }
        return true;
      });
      return {
        resource: x,
        actions: filterAction,
      };
    });

    res.status(200).json(_resourceActions);
  } catch (error) {
    next(error);
  }
};

export const getDetailRole = async (req, res, next) => {
  try {
    const id = req.query.id;
    const listRole = await getPermissions(id);
    if (!listRole) {
      return next(createError(400, MESSAGE_ERROR.ROLE_NOT_EXISTS));
    }
    const permissions = (listRole[0]?.permissions || [])
      .map((x) => {
        return x?.actions.map((y) => {
          return {
            actionCode: y.code,
            resourceCode: x.resource?.code,
          };
        });
      })
      .flat();
    const data = {
      id: listRole[0]?._id,
      roleName: listRole[0]?.roleName,
      description: listRole[0]?.description,
      permissions: permissions,
    };
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
