// TRang kiến thức Nha khoa

import DentalKnowledge from "../models/DentalKnowledge.js";
import { convertFilter } from "../util/index.js";


  export const createDentalKnowledge = async (req, res, next) => {
    try {
      const {  name, descreption, image } = req.body;
      const newDentalKnowledge = new DentalKnowledge({
        name,
        descreption,
        image
      });
      console.log("newDentalKnowledge",newDentalKnowledge)
        const createdDentalKnowledge = await newDentalKnowledge.save();
  
      res.status(201).json(createdDentalKnowledge);
    } catch (error) {
      next(error);
    }
  };
  export const updateDentalKnowledge = async (req, res, next) => {
    try {
        const DentalKnowledgeId = req?.params?.id;
        const data = req.body;
        const checkID = await DentalKnowledge.findOne({ _id: DentalKnowledgeId});
        console.log("checkID", checkID);
        if (!checkID) {
          return res.status(404).json({ message: "Trường này khôgn tồn tại" });
        }
        const updateDentalKnowledge = await DentalKnowledge.findOneAndUpdate(
          { _id: DentalKnowledgeId },
          { $set: data },
          { new: true }
        );
        console.log("updateDentalKnowledge", updateDentalKnowledge);
      
        if (updateDentalKnowledge === null) {
          return res.status(500).json({ message: "Không thể cập nhật ID." });
        }
      
        res.status(200).json({
          message: "DentalKnowledge đã được cập nhật.",
          updateDentalKnowledge,
        });
      } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ message: "Lỗi server." });
      }
  };
export const deleteDentalKnowledge = async (req, res, next) => {
    try {
      await DentalKnowledge.findByIdAndDelete(req.params.id);
      res.status(200).json("DentalKnowledge has been deleted.");
    } catch (err) {
      next(err);
    }
  };

  export const getDentalKnowledge  = async (req, res, next) => {
    try {
      const { Page, PageSize, Sorts, filters } = req.query;
      const page = parseInt(Page) || 1;
      const pageSize = parseInt(PageSize) || 10;
      const _filter = convertFilter(filters);
      const getDentalKnowledge  = await DentalKnowledge.find(_filter, "-createdAt -updatedAt -__v")
        .find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort(Sorts)
        .lean();
      const total = DentalKnowledge.find(_filter);
      const totalUsers = await DentalKnowledge.countDocuments(total);
  
      res.status(200).json({ getDentalKnowledge , totalUsers });
      } catch (err) {
        next(err);
      }
    };
  


    export const getKnowledgeId = async (req, res, next) => {
      try {
        const getDentalKnowledge = await DentalKnowledge.findOne({ _id: req.params.id}).exec();
        if (!getDentalKnowledge) {
          return res.status(404).json({message: "getDentalKnowledgeId không tồn tại"})
        }
       const data = { ...getDentalKnowledge._doc};
  
        return res.status(200).json({message: "Lay Ra DentalKnowledge thành công",data});
      } catch (err) {
        next(err);
      }
    };