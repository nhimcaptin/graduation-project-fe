import Policy from "../models/Policy.js";

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
  } catch (error) {
    next(error);
  }
};
