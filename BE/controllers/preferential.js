import Preferential from "../models/Preferential.js";
import { convertFilter } from "../util/index.js";

export const createPreferential = async (req, res, next) => {
  try {
    const data = req.body;

    const newPreferential = new Preferential(data);

    const createdPreferential = await newPreferential.save();

    res.status(201).json(createdPreferential);
  } catch (error) {
    next(error);
  }
};

export const detailPreferential = async (req, res, next) => {
  try {
    const data = req.body;
    const detail = await Preferential.findById(req.params.id, "").exec();

    res.status(201).json(detail);
  } catch (error) {
    next(error);
  }
};

export const updatePreferential = async (req, res, next) => {
  try {
    const updatePreferential = await Preferential.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updatePreferential);
  } catch (err) {
    next(err);
  }
};

export const deletePreferential = async (req, res, next) => {
  try {
    await Preferential.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const addPreferentialItem = async (req, res, next) => {
  try {
    const preferentialId = req.params.id;
    const { classify, discountAmount, allInPrice, origin, guarantee } = req.body;
    const preferential = await Preferential.findById(preferentialId);

    if (!preferential) {
      return res.status(401).json({ message: "Không tìm thấy ưu đãi chính" });
    }

    const newPreferentialItem = {
      classify,
      discountAmount,
      allInPrice,
      origin,
      guarantee,
    };

    preferential.items.push(newPreferentialItem);
    await preferential.save();
    res.status(201).json(preferential);
  } catch (error) {
    next(error);
  }
};

export const getAllPreferentials = async (req, res, next) => {
  try {
    const { Page, PageSize, Sorts, filters } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 10;
    const _filter = convertFilter(filters);
    const preferentialsWithItems = await Preferential.find(_filter, "-updatedAt -__v")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(Sorts);
    const total = await Preferential.find(_filter);
    const totalUsers = total.length;
    res.status(200).json({ preferentialsWithItems, totalUsers });
  } catch (error) {
    next(error);
  }
};
