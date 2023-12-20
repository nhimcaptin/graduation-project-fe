import Booking from "../models/Booking.js";
import TimeType from "../models/TimeType.js";
import { convertFilter } from "../util/index.js";

export const createTimeType = async (req, res, next) => {
  try {
    const data = req.body;
    const { timeSlot } = data;

    const existingTimeType = await TimeType.findOne({ timeSlot });
    if (existingTimeType) {
      return res.status(400).json({ message: "Khung giờ khám đã tồn tại" });
    }

    const newTimeType = new TimeType({ timeSlot });
    await newTimeType.save();

    const createdTimeType = await TimeType.findById(newTimeType._id).select("-_id -__v").lean();

    res.status(201).json({ message: "Khung giờ đã được thêm mới", timeType: createdTimeType });
  } catch (err) {
    next(err);
  }
};

export const getListTimeTypes = async (req, res, next) => {
  try {
    const { filters } = req.query;
    const _filter = convertFilter(filters);
    const startDate = new Date(_filter.date);
    const date = await Booking.find({
      date: { $gte: startDate, $lt: new Date(startDate.getTime() + 24 * 60 * 60 * 1000) },
      doctorId: _filter.doctorId,
    });
    const timeTypes = await TimeType.find({}, "-__v").lean();
    const listHour = timeTypes?.map((x) => {
      return {
        ...x,
        count: date.filter((y) => y?.timeTypeId?.toString() == x?._id?.toString())?.length,
      };
    });

    res.status(200).json(listHour);
  } catch (err) {
    next(err);
  }
};
