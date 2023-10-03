import jwt from "jsonwebtoken";
import { createError } from "../middlewares/error.js";
import { routers } from "./permissions.js";
import User from "../models/User.js";

export const verifyToken = (req, res, next, verifyPermissions) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "you are not authenticated"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "token is not valid!"));
    req.user = user;
    next();
  });
  verifyPermissions && verifyPermissions();
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  const _data = {
    baseUrl: req.baseUrl,
    method: req.method,
    token: req.cookies.access_token,
  };
  verifyToken(req, res, next, async () => {
    const _checkPermissions = await checkPermissions(_data);
    if (req.user.isAdmin && _checkPermissions) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

const checkPermissions = async (req) => {
  const decoded = jwt.verify(req.token, process.env.JWT);
  const data = await User.findOne({ _id: decoded.id });
  const _path = routers.find((x) => x.url === req.baseUrl);
  return _path.permissions.find((x) => x.method === req.method).role.indexOf(data.role) >= 0;
};
