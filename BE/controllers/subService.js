
import  SubService from '../models/SubService.js'
import MainService from "../models/MainServices.js";

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
        const subservicerId = req.params.id;
        const data = req.body;
        const checkID = await SubService.findOne({ _id: subservicerId });
        console.log("checkID", checkID);
        if (checkID === null) {
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
  