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
    const {
      patientId,
      doctorId,
      date,
      timeTypeId,
      description,
      service,
      status,
      bookingType,
      setType,
      nameCustomer,
      birthdayCustomer,
      numberPhoneCustomer,
      emailCustomer,
      genderCustomer,
      addressCustomer,
    } = data;

    // const isExists = await Booking.findOne({ patientId,doctorId, date, timeType });
    // if (isExists) {
    //   return next(createError(400, 'Cuộc hẹn đã tồn tại.'));
    // }
    const existingBooking = await Booking.findOne({ doctorId, date, timeTypeId });
    if (existingBooking && bookingType === "Online") {
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
      setType,
      nameCustomer,
      birthdayCustomer,
      numberPhoneCustomer,
      emailCustomer,
      genderCustomer,
      addressCustomer,
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
    const booking = await Booking.findById(bookingId)
      .populate("doctorId", "-password")
      .populate("patientId", "-password")
      .populate("timeTypeId")
      .populate("service");
    if (!booking) {
      return next(createError(404, MESSAGE_ERROR.CANNOT_FIND));
    }

    res.status(200).json(booking);
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
    const booking = await Booking.find({ status: { $ne: "Done" }, ..._filter })
      .populate("doctorId", "-password")
      .populate("patientId", "-password")
      .populate("timeTypeId")
      .populate("service")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(Sorts);
    const total = await Booking.find({ status: { $ne: "Done" }, ..._filter });
    const totalUsers = total.length;
    res.status(200).json({ data: booking, totalUsers });
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

    res.status(200).json({ message: "lịch hẹn đã được cập nhật.", updatedBooking });
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

    const approvedBookings = await Booking.find({ status: "Approved" })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ statusUpdateTime: 1 });

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

    const approvedBookings = await Booking.find({ status: "Cancel" })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ date: 1 });

    res.status(200).json(approvedBookings);
  } catch (err) {
    next(err);
  }
};

export const getListDoneBookings = async (req, res, next) => {
  try {
    const { Page, PageSize } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 10;

    const approvedBookings = await Booking.find({ status: "Done" })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ date: 1 });

    res.status(200).json(approvedBookings);
  } catch (err) {
    next(err);
  }
};
//get list bookings có status waiting và tái khám (re-examination)
export const getListWaitingBookings = async (req, res, next) => {
  try {
    const { Page, PageSize } = req.query;
    const page = parseInt(Page) || 1;
    const pageSize = parseInt(PageSize) || 10;

    const approvedBookings = await Booking.find({ status: "Waiting" })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ date: 1 });

    res.status(200).json(approvedBookings);
  } catch (err) {
    next(err);
  }
};

export const getDetailComeCheck = async (req, res, next) => {
  try {
    const Id = req.params.id;
    const approvedBookings = await Booking.findById(Id);
    console.log("approvedBookings", approvedBookings);
    const service = await MainServices.findById(approvedBookings.service);
    const user = await User.findById(approvedBookings?.patientId).select("-password").lean();
    res.status(200).json({
      user,
      service,
      doctorId: approvedBookings?.doctorId,
      timeTypeId: approvedBookings?.timeTypeId,
      bookingType: approvedBookings?.bookingType,
    });
  } catch (err) {
    next(err);
  }
};
