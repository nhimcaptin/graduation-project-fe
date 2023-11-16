import Policy from "../models/Policy.js";
import { convertFilter } from "../util/index.js";

export const createPolicy  = async (req, res, next) => {
  try {
    const {  name, description  } = req.body;
    const newPolicy = new Policy({
      name,
      description,
    });
    console.log("newPolicy",newPolicy)
      const createPolicy = await newPolicy.save();
    res.status(201).json(createPolicy);
    console.log("createPolicy",createPolicy)
  } catch (error) {
    next(error);
  }
};

export const updatePolicy  = async (req, res, next) => {
  try {
      const PolicyId = req?.params?.id;
      const data = req.body;
      const checkID = await Policy.findOne({ _id: PolicyId});
      console.log("checkID", checkID);
      if (!checkID) {
        return res.status(404).json({ message: "Trường này khôgn tồn tại" });
      }
      const updatePolicy  = await Policy.findOneAndUpdate(
        { _id: PolicyId },
        { $set: data },
        { new: true }
      );
      console.log("updatePolicy", updatePolicy );
    
      if (updatePolicy  === null) {
        return res.status(500).json({ message: "Không thể cập nhật ID." });
      }
    
      res.status(200).json({
        message: "updatePolicy  đã được cập nhật.",
        updatePolicy ,
      });
    } catch (error) {
      console.error("Lỗi:", error);
      res.status(500).json({ message: "Lỗi server." });
    }
};

export const deletePolicy = async (req, res, next) => {
  try {
    await Policy.findByIdAndDelete(req.params.id);
    res.status(200).json("Policy has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getPolicy  = async (req, res, next) => {
  try {
    const { Page, PageSize, Sorts, filters } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 5;
    const _filter = convertFilter(filters);
    const getPolicy  = await Policy.find(_filter, "-createdAt -updatedAt -__v")
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(Sorts)
      .lean();
    const total = Policy.find(_filter);
    const totalUsers = await Policy.countDocuments(total);

    res.status(200).json({ getPolicy , totalUsers });
    } catch (err) {
      next(err);
    }
  };
export const getPolicyId = async (req, res, next) => {
    try {
      const getPolicy = await Policy.findOne({ _id: req.params.id}).exec();
      if (!getPolicy) {
        return res.status(404).json({message: "getPolicy không tồn tại"})
      }
     const data = { ...getPolicy._doc};

      return res.status(200).json({message: "Lay Ra Polyci thành công",data});
    } catch (err) {
      next(err);
    }
  };
