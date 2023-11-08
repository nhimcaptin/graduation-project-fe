import { convertFilter } from "../util/index.js";
import News from "../models/News.js"

  export const createNews = async (req, res, next) => {
    try {
      const {  name, description, image } = req.body;
      const newNews = new News({
        name,
        description,
        image
      });
      console.log("newNews",newNews)
        const createdNews = await newNews.save();
  
      res.status(201).json(createdNews);
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
      const getDentalKnowledge  = await DentalKnowledge .find(_filter, "-createdAt -updatedAt -__v")
        .find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort(Sorts)
        .lean();
      const total = DentalKnowledge .find(_filter);
      const totalUsers = await DentalKnowledge .countDocuments(total);
  
      res.status(200).json({ getDentalKnowledge , totalUsers });
      } catch (err) {
        next(err);
      }
    };
  

