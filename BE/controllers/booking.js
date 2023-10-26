import { MESSAGE_ERROR } from "../const/messages.js";
import { createError } from "../middlewares/error.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { convertFilter } from "../util/index.js";

export const createBooking = async (req, res, next) => {
  try {
    const data = req.body;
    const { patientId, doctorId, date, timeTypeId, description, service, status,bookingType } = data;

    // const isExists = await Booking.findOne({ patientId,doctorId, date, timeType });

    // if (isExists) {
    //   return next(createError(400, 'Cuộc hẹn đã tồn tại.'));
    // }
    const existingBooking = await Booking.findOne({ doctorId, date, timeTypeId });
    if (existingBooking) {
      return res.status(400).json({ message: "Cuộc hẹn trùng lặp." });
    }

    const time = await TimeType.findById(timeTypeId);
    console.log(time);
    if (!time) {
      return res.status(400).json({ message: "Không tìm thấy khung giờ khám" });
    }
    // const doctor = await User.findOne({ _id: doctorId, role: 'Doctor' });
    // if (!doctor) {
    //   return next(createError(404, MESSAGE_ERROR.CANNOT_FIND));
    // }
    const newBooking = new Booking({
      patientId,
      doctorId,
      date,
      timeTypeId,
      description,
      service,
      status,
      bookingType,
    });

    await newBooking.save();
    res.status(200).json({ booking: newBooking, request: req.body });
  } catch (err) {
    next(err);
  }
};

export const getDetailBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(createError(404, MESSAGE_ERROR.CANNOT_FIND));
    }

    const doctor = await User.findOne({ _id: booking.doctorId });
    if (!doctor) {
      return next(createError(404, MESSAGE_ERROR.CANNOT_FIND));
    }

    const patient = await User.findOne({ _id: booking.patientId });
    if (!patient) {
      return next(createError(404, MESSAGE_ERROR.CANNOT_FIND));
    }
    res.status(200).json({
      booking: { ...booking._doc },
      doctor: {
        //_id: doctor._id,
        name: doctor.name,
      },
      patient: {
        //_id: patient._id,
        name: patient.name,
      },
    });
  } catch (err) {
    next(err);
  }
};
export const getBooking = async (req, res, next) => {
  try {
    const { Page, PageSize, Sorts, filters } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 10;
    const _filter = convertFilter(filters);
    const booking = await Booking.find(_filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(Sorts);
    const totalUsers = booking.length;
    const listData = [];
    for (let item of booking) {
      const doctor = await User.findOne({ _id: item.doctorId });
      const patient = await User.findOne({ _id: item.patientId });
      if (doctor && patient) {
        listData.push({
          ...item._doc,
          patientName: patient.name,
          doctorName: doctor.name,
        });
      }
    }
    res.status(200).json({ data: listData, totalUsers });
  } catch (err) {
    next(err);
  }
};
