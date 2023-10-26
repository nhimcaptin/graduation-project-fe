import { MESSAGE_ERROR } from '../const/messages.js';
import { createError } from '../middlewares/error.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

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
export const getBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return next(createError(404, MESSAGE_ERROR.CANNOT_FIND));
    }
    const doctor = await User.findOne({ _id: booking.doctorId, role: 'Doctor' });

    if (!doctor) {
      return next(createError(404, MESSAGE_ERROR.CANNOT_FIND));
    }
    const patient = await User.findOne({ _id: booking.patientId, role: 'User' });

    if (!patient) {
      return next(createError(404, MESSAGE_ERROR.CANNOT_FIND));
    }
    res.status(200).json({
      booking: { ...booking._doc },
      doctor: {
        _id: doctor._id,
        name: doctor.name,
      },
      patient: {
        _id: patient._id,
        name: patient.name,
      },
    });
  } catch (err) {
    next(err);
  }
};
// lấy ra danh sách boking
export const getAllBoking = async (req, res, next) => {
  try {
    const getAllBoking = await Booking.find({}).lean();
    const data = []
    for (const x of getAllBoking) {
      // lấy ra name theo patientID  
      const detailUser = await User.findById(x.patientId);
      const detailDoctor = await User.findById(x.doctorId);
      const userName = detailUser.name;
      const nameDoctor = detailDoctor.name;
      data.push({
        ...x,
        userName,
        nameDoctor
      })
    }
    res.status(200).json(data)
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const { status } = req.body; 
    const booking = await Booking.findById(id);
    console.log(id)
    if (!booking) {
      return res.status(404).json({ message: "Cuộc hẹn không tồn tại." });
    }
    booking.status = status;
    await booking.save();
   res.status(200).json({ message: "Trạng thái lịch hẹn đã được cập nhật.", booking });
  } catch (err) {
    next(err);
  }
};

// //update Booking
// export const updateBooking = async (req, res, next) => {
//   try {
//     const  checkValidate = req.params;

//     const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
//     res.status(200).json(updatedUser);
//   } catch (err) {
//     next(err);
//   };
// };
