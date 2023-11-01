
import  SubService from '../models/SubService.js'
import MainService from "../models/MainServices.js";
import { convertFilter } from "../util/index.js";


export const creatSubservice = async (req, res, next) => {
    try {
     const subID = req.params.id;
     const data = req.body;
     const isExists = await MainService.findOne({_id: subID});
     const checkName = await SubService.findOne({name : data.name})
     if(checkName){
        return res.status(400).json({message:"Dich Vu Nay Da Ton Tai"})
     }
     if(isExists){
        let { mainServiceID, name, price, description, image} = data;
        mainServiceID = subID;
        const newSubService = new SubService({
           mainServiceID,
           name,
           price,
           description,
           image,
         });
         await newSubService.save();
           res.status(201).json({ message: "Dịch vụ  đã được tạo.", newSubService});       
     }
    } catch (err) {
      next(err);
    }
  };

export const updateSubservice = async (req, res, next) => {
    try {
        const subservicerId = req?.params?.id;
        const data = req.body;
        const checkID = await SubService.findOne({ _id: subservicerId});
        console.log("checkID", checkID);
        if (!checkID) {
          return res.status(404).json({ message: "dich vu khong ton tai" });
        }
        const updateSubservice = await SubService.findOneAndUpdate(
          { _id: subservicerId },
          { $set: data },
          { new: true }
        );
        console.log("updateSubservice", updateSubservice);
      
        if (updateSubservice === null) {
          return res.status(500).json({ message: "Không thể cập nhật ID." });
        }
      
        res.status(200).json({
          message: "Trạng thái lịch hẹn đã được cập nhật.",
          updateSubservice,
        });
      } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ message: "Lỗi server." });
      }
  };
export const deleteSubservice = async (req, res, next) => {
    try {
      await SubService.findByIdAndDelete(req.params.id);
      res.status(200).json("SubService has been deleted.");
    } catch (err) {
      next(err);
    }
  };
  export const getSubservice = async (req, res, next) => {
    try {
      const { Page, PageSize, Sorts, filters } = req.query;
      const page = parseInt(Page) || 1;
      const pageSize = parseInt(PageSize) || 10;
      const _filter = convertFilter(filters);
      const getSubservice = await SubService.find(_filter, "-createdAt -updatedAt -__v")
        .find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort(Sorts)
        .lean();
      const total = SubService.find(_filter);
      const totalUsers = await SubService.countDocuments(total);
  
      res.status(200).json({ getSubservice, totalUsers });
      } catch (err) {
        next(err);
      }
    };
    