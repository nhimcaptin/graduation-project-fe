import { MESSAGE_ERROR } from '../const/messages.js';
import { createError } from '../middlewares/error.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js'; // Import mô hình User từ tệp model

export const createBooking = async (req, res, next) => {
  try {
    const data = req.body;
    const { patientId, doctorId, date, timeType, description, service, status } = data;

    const isExists = await Booking.findOne({ patientId, date, timeType });

    if (isExists) {
      return next(createError(400, 'Cuộc hẹn đã tồn tại.'));
    }
    const doctor = await User.findOne({ _id: doctorId, role: 'Doctor' });
    if (!doctor) {
      return next(createError(404, MESSAGE_ERROR.CANNOT_FIND));
    }
    const newBooking = new Booking({
      patientId,
      doctorId,
      date,
      timeType,
      description,
      service,
      status,
    });

    await newBooking.save();
    res.status(200).json({ doctor, booking: newBooking, request: req.body });
  } catch (err) {
    next(err);
  }
};
