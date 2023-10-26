
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
           res.status(201).json({ message: "Dịch vụ  đã được tạo.",newSubService: newSubService});       
     }
    } catch (err) {
      next(err);
    }
  };