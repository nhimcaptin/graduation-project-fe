import { MESSAGE_ERROR } from "../const/messages.js";
import { createError } from "../middlewares/error.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      ...req.body,
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
    const data = { ...detailUser._doc, password: null };
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
    const decoded = jwt.verify(req.cookies.access_token, process.env.JWT);
    const data = await User.findOne({ _id: decoded.id });
    const user = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      img: data.img,
      role: data.role,
    };
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
