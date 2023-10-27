import { MESSAGE_ERROR } from "../const/messages.js";
import { createError } from "../middlewares/error.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import TimeType from "../models/TimeType.js";
import { convertFilter } from "../util/index.js";
import MainServices from "../models/MainServices.js";

export const createBooking = async (req, res, next) => {
  try {
    const data = req.body;
    const { patientId, doctorId, date, timeTypeId, description, service, status, bookingType } = data;

    // const isExists = await Booking.findOne({ patientId,doctorId, date, timeType });

    // if (isExists) {
    //   return next(createError(400, 'Cuộc hẹn đã tồn tại.'));
    // }
    const existingBooking = await Booking.findOne({ doctorId, date, timeTypeId });
    if (existingBooking) {
      return res.status(400).json({ message: "Cuộc hẹn trùng lặp." });
    }

    // const time = await TimeType.findById(timeTypeId);
    // console.log(time);
    // if (!time) {
    //   return res.status(400).json({ message: "Không tìm thấy khung giờ khám" });
    // }
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
    const timeType = await TimeType.findOne({ _id: booking.timeTypeId });

    const service = await MainServices.findOne({ _id: booking.service });
    if (!service) {
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
      service: {
        //_id: service._id,
        name: service.name,
      },
      ...(timeType && {
        timeType: {
          //_id: timeType._id,
          name: timeType?.timeSlot,
        },
      }),
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
      const timeType = await TimeType.findOne({ _id: item.timeTypeId });
      const service = await MainServices.findOne({ _id: item.service });
      if (doctor && patient && service) {
        listData.push({
          ...item._doc,
          patientName: patient.name,
          doctorName: doctor.name,
          service: service?.name || "",
          timeSlot: timeType?.timeSlot || "",
        });
      }
    }
    res.status(200).json({ data: listData, totalUsers });
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { statusUpdateTime } = req.body;

    const booking = await Booking.findById(id);
    console.log(id);

    if (!booking) {
      return res.status(404).json({ message: "Cuộc hẹn không tồn tại." });
    }

    if (status !== booking.status) {
      // Chỉ cập nhật thời gian nếu trạng thái thay đổi
      booking.status = status;
      booking.statusUpdateTime = statusUpdateTime;

      await booking.save();
    }

    res.status(200).json({ message: "Trạng thái lịch hẹn đã được cập nhật.", booking });
  } catch (err) {
    next(err);
  }
};

export const updateBookingDetail = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const updatedData = req.body;

    const updatedBooking = await Booking.findOneAndUpdate({ _id: bookingId }, { $set: updatedData }, { new: true });

    if (!updatedBooking) {
      res.status(401).json({ message: "không tìm thấy lịch hẹn" });
      return;
    }

    res.status(200).json({ message: "Trạng thái lịch hẹn đã được cập nhật.", updatedBooking });
  } catch (err) {
    next(err);
  }
};

export const getUserAndBookings = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    console.log(userId);
    if (!user) {
      return res.status(401).json({ message: "không tìm thấy người dùng" });
    }
    const bookings = await Booking.find({
      $or: [{ patientId: userId }],
    });
    const result = {
      user,
      bookings,
    };
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getListApprovedBookings = async (req, res, next) => {
  try {
    const { Page, PageSize } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 10;

    const approvedBookings = await Booking.find({ status: "approved" })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json(approvedBookings);
  } catch (err) {
    next(err);
  }
};

export const getListCancelBookings = async (req, res, next) => {
  try {
    const { Page, PageSize } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 10;

    const approvedBookings = await Booking.find({ status: "cancel" })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json(approvedBookings);
  } catch (err) {
    next(err);
  }
};
export const getListWaitingBookings = async (req, res, next) => {
  try {
    const { Page, PageSize } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 10;

    const approvedBookings = await Booking.find({ status: "Waiting" })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json(approvedBookings);
  } catch (err) {
    next(err);
  }
};
