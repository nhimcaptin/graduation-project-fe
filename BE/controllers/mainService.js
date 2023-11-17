import MainService from "../models/MainServices.js";
import { convertFilter } from "../util/index.js";

export const createMainService = async (req, res, next) => {
  try {
    const data = req.body;
    const { name, description ,descriptionMain } = data;
    const newMainService = new MainService({
      name,
      description,
      descriptionMain
    });
    await newMainService.save();

    const createdMainService = await MainService.findById(newMainService._id)
      .select("-_id -createdAt -updatedAt -__v")
      .lean();
    res.status(201).json({ message: "Dịch vụ chính đã được tạo.", mainService: createdMainService });
  } catch (err) {
    next(err);
  }
};

export const getMainService = async (req, res, next) => {
  try {
    const mainServiceId = req.params.id;
    const mainService = await MainService.findById(mainServiceId).select("-createdAt -updatedAt -__v").lean();

    if (!mainService) {
      return next(createError(404, "Dịch vụ k tồn tại."));
    }
    res.status(200).json(mainService);
  } catch (err) {
    next(err);
  }
};

export const getAllMainServices = async (req, res, next) => {
  try {
    const { Page, PageSize, Sorts, filters } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 10;
    const _filter = convertFilter(filters);
    const mainServices = await MainService.find(_filter, "-createdAt -updatedAt -__v")
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(Sorts)
      .lean();
    const total = MainService.find(_filter);
    const totalUsers = await MainService.countDocuments(total);

    res.status(200).json({ mainServices, totalUsers });
  } catch (err) {
    next(err);
  }
};

export const updateMainServices = async (req, res, next) => {
  try {
    const mainServices = await MainService.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!mainServices) {
      return res.status(401).json({ message: "Không tìm thấy MainServices" });
    }
    res.status(200).json({ mainServices, message: "Update  Thành Công" });
  } catch (err) {
    next(err);
  }
};

export const deleteMainServices = async (req, res, next) => {
  try {
    await MainService.findByIdAndDelete(req.params.id);
    res.status(200).json("MainServices has been deleted.");
  } catch (err) {
    next(err);
  }
};
