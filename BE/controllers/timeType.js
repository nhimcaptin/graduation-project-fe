import TimeType from "../models/TimeType.js";

export const createTimeType = async (req, res, next) => {
    try {
      const data = req.body;
      const { timeSlot } = data;
  
      const existingTimeType = await TimeType.findOne({ timeSlot });
      if (existingTimeType) {
        return res.status(400).json({ message: 'Khung giờ khám đã tồn tại' });
      }
  
      const newTimeType = new TimeType({ timeSlot });
      await newTimeType.save();

      const createdTimeType = await TimeType.findById(newTimeType._id)
      .select('-_id -__v')
      .lean();
  
      res.status(201).json({ message: 'Khung giờ đã được thêm mới', timeType: createdTimeType });
    } catch (err) {
      next(err);
    }
  };
  

