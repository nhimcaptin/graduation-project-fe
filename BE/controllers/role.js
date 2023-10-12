import { MESSAGE_ERROR } from "../const/messages.js";
import { createError } from "../middlewares/error.js";
import Action from "../models/Action.js";
import Resource from "../models/Resource.js";
import Role from "../models/Role.js";
import { getPermissions } from "../util/index.js";

export const createRole = async (req, res, next) => {
  try {
    await new Role({
      roleId: new Date().getTime(),
      roleName: "Admin",
      description: "Người quản trị viên",
      permissions: [
        {
          resource: {
            _id: "6526c912314b2b5780558db1",
          },
          actions: [
            {
              _id: "6526ca06314b2b5780558dbb",
            },
            {
              _id: "6526ca32314b2b5780558dbd",
            },
          ],
        },
      ],
    }).save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const updatedUser = await Role.findOneAndUpdate(
      { roleId: 1696905458637 },
      {
        $set: {
          permissions: [
            {
              resource: {
                code: "Branches",
                name: "Cửa hàng",
              },
              actions: [
                {
                  code: "View",
                  name: "Xem",
                },
                {
                  code: "Create",
                  name: "Thêm",
                },
                {
                  code: "Update",
                  name: "Sửa",
                },
                {
                  code: "Delete",
                  name: "Xoá",
                },
              ],
            },
          ],
        },
      }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const resourceActions = async (req, res) => {
  try {
    const _resource = await Resource.find();
    const _action = await Action.find();
    const _resourceActions = _resource.map((x) => {
      const filterAction = _action.filter((y) => (y?.code === "Export" ? ["User", "Staff"].includes(x?.code) : true));
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
    const permissions = (listRole[0].permissions || []).map((x) => {
      return x?.actions.map((y) => {
        return {
          actionCode: y.code,
          resourceCode: x.resource?.code,
        };
      });
    }).flat();
    const data = {
      id: listRole[0]._id,
      roleName: listRole[0].roleName,
      description: listRole[0].description,
      permissions: permissions
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
