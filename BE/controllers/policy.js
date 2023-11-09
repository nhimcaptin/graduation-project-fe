import Policy from "../models/Policy.js";
import { convertFilter } from "../util/index.js";


// export const createPolicy = async (req, res, next) => {
//   try {
//     const { name, items } = req.body;

//     const newPolicy = new Policy({
//       name,
//       items,
//     });

//     const createPolicy = await newPolicy.save();

//     res.status(201).json(createPolicy); 
//   } catch (error) {
//     next(error); 
//   }
// };


// export const addPreferentialItem = async (req, res, next) => {
//   try {
//     const preferentialId = req.params.id; 
//     const { classify, description } = req.body;
//     const preferential = await Preferential.findById(preferentialId);

//     if (!preferential) {
//       return res.status(401).json({ message: "Không tìm thấy chính sách" });
//     }

//     const newPreferentialItem = {
//       classify,
//       description
//     };

//     preferential.items.push(newPreferentialItem);
//     await preferential.save();
//     res.status(201).json(preferential); 
//   } catch (error) {
//     next(error); 
//   }
// };



// export const getAllPreferentials = async (req, res, next) => {
//   try {
//     const preferentialsWithItems = await Preferential.aggregate([
//       {
//         $unwind: "$items" 
//       },
//       {
//         $group: {
//           _id: "$_id",
//           name: { $first: "$name" },
//           itemCount: { $sum: 1 }, 
//           items: { $push: "$items" } 
//         }
//       }
//     ]);
//     res.status(200).json(preferentialsWithItems); 
//   } catch (error) {
//     next(error); 
//   }
// };

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
    const pageSize = parseInt(PageSize) || 10;
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

