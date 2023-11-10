import { MESSAGE_ERROR } from "../const/messages.js";
import { createError } from "../middlewares/error.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { convertFilter } from "../util/index.js";
import Role from "../models/Role.js";

export const createUser = async (req, res, next) => {
  try {
    const data = req.body;
    const { email } = data;
    const isExists = await User.findOne({ email: email });
    if (isExists) {
      return next(createError(400, MESSAGE_ERROR.MAIL_ALREADY_EXISTS));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("admin123456", salt);
    await new User({
      ...data,
      role: data?.role || undefined,
      isAdmin: !!data?.role,
      password: hash,
    }).save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const detailUser = async (req, res, next) => {
  try {
    const detailUser = await User.findById(req.params.id).exec();
    const roleDetail = detailUser?.role ? await Role.findById(detailUser.role) : null;
    const data = {
      ...detailUser._doc,
      ...(roleDetail && {
        role: {
          value: roleDetail?._id,
          label: roleDetail.roleName,
        },
      }),
      password: null,
    };
    delete data.password;
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const detailDoctor = async (req, res, next) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: "Doctor" }).exec();
    if (!doctor) {
      return res.status(404).json({ message: "Bác sĩ không tồn tại." });
    }

    const data = { ...doctor._doc, password: null };
    delete data.password;

    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.header("authorization").replace("Bearer ", ""), process.env.JWT);
    const data = await User.findOne({ _id: decoded.id });
    const user = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      img: data.img,
      role: data.role,
    };
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getListUser = async (req, res, next) => {
  try {
    const { Page, PageSize, Sorts, filters } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 10;
    const _filter = convertFilter(filters);
    const query = User.find(_filter);
    const users = await query
      .populate("role")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(Sorts);
    const totalUsers = await User.countDocuments(query);
    res.json({ data: users, totalUsers });
  } catch (error) {
    next(error);
  }
};

export const getListDoctors = async (req, res, next) => {
  try {
    const { Page, PageSize, Sorts, filters } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 10;
    const _filter = convertFilter(filters);
    const role = await Role.findOne({ roleName: "Doctor" });
    const query = User.find({ role: role?._id, ..._filter });
    const doctors = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(Sorts);
    const totalDoctors = await User.countDocuments({ role: role?._id, ..._filter });

    res.json({ doctors, totalDoctors });
  } catch (error) {
    next(error);
  }
};
