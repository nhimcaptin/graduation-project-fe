import { MESSAGE_ERROR } from "../const/messages.js";
import { createError } from "../middlewares/error.js";
import Action from "../models/Action.js";
import Resource from "../models/Resource.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import { convertFilter } from "../util/index.js";
import jwt from "jsonwebtoken";

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
      { code: "Staff", name: "Nhân Viên" }
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
    const { Page, PageSize, Sorts, filters } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 10;
    const _filter = convertFilter(filters);
    const listRole = await Role.find(_filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(Sorts);
    const data = listRole.map((x) => {
      return {
        _id: x?._id,
        roleName: x.roleName,
        description: x?.description,
      };
    });
    const totalUsers = listRole.length;
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
          if (x?.code === "LoginAdmin") return false;
          return true;
        }
        if (y?.code === "LoginAdmin") {
          if (x?.code === "LoginAdmin") return true;
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
    const listRole = await Role.findOne(id ? { _id: id } : {})
      .populate({
        path: "permissions",
        populate: {
          path: "resource",
          model: "Resource",
        },
      })
      .populate({
        path: "permissions.actions",
        model: "Action",
      });
    if (!listRole) {
      return next(createError(400, MESSAGE_ERROR.ROLE_NOT_EXISTS));
    }
    const permissions = (listRole?.permissions || [])
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
      id: listRole?._id,
      roleName: listRole?.roleName,
      description: listRole?.description,
      permissions: permissions,
    };
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getPermission = async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.header("authorization").replace("Bearer ", ""), process.env.JWT);
    const data = await User.findOne({ _id: decoded.id }).populate({
      path: "role",
      populate: {
        path: "permissions",
        populate: [
          {
            path: "resource",
            model: "Resource",
          },
          {
            path: "actions",
            model: "Action",
          },
        ],
      },
    });
    return res.status(200).json({ permissions: data?.role?.permissions });
  } catch (error) {
    next(error);
  }
};
