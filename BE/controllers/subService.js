import SubService from "../models/SubService.js";
import MainService from "../models/MainServices.js";
import { convertFilter } from "../util/index.js";

export const createSubService = async (req, res, next) => {
  try {
    const { mainServiceID, name, price, aesthetics, treatmentTime, examination, image } = req.body;
    const newSubService = new SubService({
      mainServiceID,
      name,
      price,
      aesthetics,
      treatmentTime,
      examination,
      image,
    });
    const createdSubService = await newSubService.save();

    res.status(201).json(createdSubService);
  } catch (error) {
    next(error);
  }
};

export const updateSubservice = async (req, res, next) => {
  try {
    const subservicerId = req?.params?.id;
    const data = req.body;
    const checkID = await SubService.findOne({ _id: subservicerId });
    console.log("checkID", checkID);
    if (!checkID) {
      return res.status(404).json({ message: "dich vu khong ton tai" });
    }
    const updateSubservice = await SubService.findOneAndUpdate({ _id: subservicerId }, { $set: data }, { new: true });
    console.log("updateSubservice", updateSubservice);

    if (updateSubservice === null) {
      return res.status(500).json({ message: "Không thể cập nhật ID." });
    }

    res.status(200).json({
      message: "Dịch vụ đã được cập nhật.",
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
      .populate("mainServiceID")
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

export const detailSubservice = async (req, res, next) => {
  try {
    // const subService = await SubService.findOne({ _id: req.params.id }).exec();
    // const Id_mainService_Subservice = subService.mainServiceID;
    // const detailMainservice = await MainService.findOne({ _id: Id_mainService_Subservice }).exec();
    // if (!detailMainservice) {
    //   return res.status(404).json({ message: "Không lấy được ID mainService" });
    // }

    // const nameService = detailMainservice.name;
    // if (!subService) {
    //   return res.status(404).json({ message: "Service không tồn tại" });
    // }
    // const data = { ...subService._doc, nameService };  
    // return res.status(200).json(data);
    const subService = await SubService.findById(req.params.id, "-updatedAt -__v").populate(
      "mainServiceID",
      "-updatedAt -__v"
    );
    if (!subService.mainServiceID) {
      return res.status(500).json({ message: "Service không tồn tại" });
    }
    return res.status(200).json(subService);
  } catch (err) {
    next(err);
  }
};

export const getAllServices = async (req, res, next) => {
  try {
    const subService = await SubService.find({}).populate("mainServiceID");
    const obj = {};
    subService.forEach((x) => {
      if (obj[x?.mainServiceID?._id]) {
        obj[x?.mainServiceID?._id]?.subService.push({
          name: x?.name,
          price: x?.price,
          aesthetics: x?.aesthetics,
          treatmentTime: x?.treatmentTime,
          examination: x?.examination,
        });
      } else {
        obj[x?.mainServiceID?._id] = {
          title: x?.mainServiceID?.name,
          _id: x?.mainServiceID?._id,
          subService: [
            {
              name: x?.name,
              price: x?.price,
              aesthetics: x?.aesthetics,
              treatmentTime: x?.treatmentTime,
              examination: x?.examination,
            },
          ],
        };
      }
    });

    res.status(200).json({ data: Object.values(obj) });
  } catch (err) {
    next(err);
  }
};

export const listSubSerViceForMain = async (req, res, next) => {
  try {
    const id = req.params.mainServiceID;
    console.log("idMain",id)
    const detailMainservice = await SubService.find({ mainServiceID: id}).exec();
    console.log("detailMainservice",detailMainservice)
    if (!detailMainservice) {
      return res.status(404).json({ message: "Không lấy được ID mainService" });
    }
    return res.status(200).json(detailMainservice);
  } catch (err) {
    next(err);
  }
};