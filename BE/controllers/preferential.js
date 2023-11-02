import Preferential from "../models/Preferential.js";

export const createPreferential = async (req, res, next) => {
  try {
    const { name, items } = req.body;

    const newPreferential = new Preferential({
      name,
      items,
    });

    const createdPreferential = await newPreferential.save();

    res.status(201).json(createdPreferential); 
  } catch (error) {
    next(error); 
  }
};


export const addPreferentialItem = async (req, res, next) => {
  try {
    const preferentialId = req.params.id; 
    const { classify, discountAmount, allInPrice, origin, guarantee } = req.body;
    const preferential = await Preferential.findById(preferentialId);

    if (!preferential) {
      return res.status(401).json({ message: "Không tìm thấy ưu đãi chính" });
    }

    const newPreferentialItem = {
      classify,
      discountAmount,
      allInPrice,
      origin,
      guarantee,
    };

    preferential.items.push(newPreferentialItem);
    await preferential.save();
    res.status(201).json(preferential); 
  } catch (error) {
    next(error); 
  }
};



export const getAllPreferentials = async (req, res, next) => {
  try {
    const preferentialsWithItems = await Preferential.aggregate([
      {
        $unwind: "$items" 
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          itemCount: { $sum: 1 }, 
          items: { $push: "$items" } 
        }
      }
    ]);
    res.status(200).json(preferentialsWithItems); 
  } catch (error) {
    next(error); 
  }
};


