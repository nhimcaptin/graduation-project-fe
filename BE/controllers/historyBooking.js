import Booking from "../models/Booking.js";
import HistoryBooking from "../models/HistoryBooking.js";
import MainServices from "../models/MainServices.js";
import User from "../models/User.js";
import { convertFilter } from "../util/index.js";

export const getListHistory = async (req, res, next) => {
  try {
    const { Page, PageSize, Sorts, filters } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 10;
    const _filter = convertFilter(filters);
    const historyBooking = await HistoryBooking.find(_filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(Sorts);
    const data = [];
    for (let item of historyBooking) {
      const doctor = await User.findOne({ _id: item.doctorId });
      const patient = await User.findOne({ _id: item.patientId });
      const service = await MainServices.findOne({ _id: item.service });
      if (doctor && patient && service) {
        data.push({
          ...item._doc,
          patientName: patient.name,
          doctorName: doctor.name,
          service: service?.name || "",
        });
      }
    }
    const total = HistoryBooking.find(_filter);
    const totalUsers = await HistoryBooking.countDocuments(total);
    res.status(200).json({ data, totalUsers });
  } catch (err) {
    next(err);
  }
};

export const addHistory = async (req, res, next) => {
  try {
    const data = req.body;
    const item = {
      patientId: data?.idPatient,
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
