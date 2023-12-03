import jwt from "jsonwebtoken";
import { createError } from "../middlewares/error.js";
import { routers } from "./permissions.js";
import User from "../models/User.js";
import { MESSAGE_ERROR } from "../const/messages.js";
import Role from "../models/Role.js";
import Resource from "../models/Resource.js";

export const verifyToken = (req, res, next, verifyPermissions) => {
  const token = req.header("authorization").replace("Bearer ", "");
  if (!token) {
    return next(createError(401, "you are not authenticated"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(401, "token is not valid!"));
    req.user = user;
  });
  verifyPermissions && verifyPermissions();
};

// export const verifyUser = (req, res, next) => {
//   verifyToken(req, res, next, () => {
//     if (req.user.id === req.params.id || req.user.isAdmin) {
//       next();
//     } else {
//       return next(createError(403, MESSAGE_ERROR.NOT_PERMISSIONS));
//     }
//   });
// };

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id ) {
      next();
    } else {
      return next(createError(403, MESSAGE_ERROR.NOT_PERMISSIONS));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  const _data = {
    baseUrl: req.baseUrl + req.route.path,
    method: req.method,
    token: req.header("authorization").replace("Bearer ", ""),
  };
  verifyToken(req, res, next, async () => {
    const _checkPermissions = await checkPermissions(_data);
    if (req.user.isAdmin && _checkPermissions) {
      next();
    } else {
      return res.status(400).json(createError(403, MESSAGE_ERROR.NOT_PERMISSIONS));
    }
  });
};

const checkPermissions = async (req) => {
  try {
    const decoded = jwt.verify(req.token, process.env.JWT);
    const data = await User.findOne({ _id: decoded.id });
    const role = await Role.findById(data.role);
    const _resource = await Resource.find();
    let idLogin;
    (_resource || []).forEach((x) => {
      if (x?.code === "LoginAdmin") {
        idLogin = x._id;
      }
    });
    const isLogin = (role?.permissions || []).find((x) => {
      return x.resource.toString() == idLogin.toString();
    });
    return !!isLogin;
  } catch (error) {
    return false;
  }
};
