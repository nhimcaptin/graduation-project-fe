import Booking from "../models/Booking.js";
import HistoryBooking from "../models/HistoryBooking.js";
import { convertFilter } from "../util/index.js";

export const getListHistory = async (req, res, next) => {
  try {
    const { Page, PageSize, Sorts, filters } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 10;
    const _filter = convertFilter(filters);
    const historyBooking = await HistoryBooking.find(_filter)
      .populate("service")
      .populate("doctorId")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(Sorts);

    const total = HistoryBooking.find(_filter);
    const totalUsers = await HistoryBooking.countDocuments(total);
    res.status(200).json({ data: historyBooking, totalUsers });
  } catch (err) {
    next(err);
  }
};

export const addHistory = async (req, res, next) => {
  try {
    const data = req.body;
    const item = {
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      address: data?.address,
      gender: data?.gender,
      birthday: data?.birthday,
      service: data?.idService,
      doctorId: data?.idDoctor,
      condition: data?.condition,
      bookingType: data?.bookingType,
    };
    await Booking.findOneAndUpdate({ _id: data?.id }, { $set: { status: "Done" } }, { new: true });
    await new HistoryBooking({
      ...item,
    }).save();
    res.status(200).json({ message: "SUCCESS" });
  } catch (err) {
    next(err);
  }
};

export const getDetailHistory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const historyDetail = await HistoryBooking.findById(id).populate("doctorId", "-password").populate("service");
    res.status(200).json({ data: historyDetail });
  } catch (err) {
    next(err);
  }
};
