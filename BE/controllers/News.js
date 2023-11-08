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
    export const updateNews = async (req, res, next) => {
    try {
        const NewsId = req?.params?.id;
        const data = req.body;
        const checkID = await News.findOne({ _id: NewsId});
        console.log("checkID", checkID);
        if (!checkID) {
          return res.status(404).json({ message: "Trường này khôgn tồn tại" });
        }
        const updateNews = await News.findOneAndUpdate(
          { _id: NewsId },
          { $set: data },
          { new: true }
        );
        console.log("News", updateNews);
      
        if (updateNews === null) {
          return res.status(500).json({ message: "Không thể cập nhật ID." });
        }
      
        res.status(200).json({
          message: "updateNews đã được cập nhật.",
          updateNews,
        });
      } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ message: "Lỗi server." });
      }
  };
export const deleteNews = async (req, res, next) => {
    try {
      await News.findByIdAndDelete(req.params.id);
      res.status(200).json("News has been deleted.");
    } catch (err) {
      next(err);
    }
  };

  export const getNews  = async (req, res, next) => {
    try {
      const { Page, PageSize, Sorts, filters } = req.query;
      const page = parseInt(Page) || 1;
      const pageSize = parseInt(PageSize) || 10;
      const _filter = convertFilter(filters);
      const getNews  = await News.find(_filter, "-createdAt -updatedAt -__v")
        .find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort(Sorts)
        .lean();
      const total = News.find(_filter);
      const totalUsers = await News.countDocuments(total);
  
      res.status(200).json({ getNews , totalUsers });
      } catch (err) {
        next(err);
      }
    };
  

