import { MESSAGE_ERROR } from "../const/messages.js";
import { createError } from "../middlewares/error.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import TimeType from "../models/TimeType.js";
import { convertFilter } from "../util/index.js";
import SubService from "../models/SubService.js";
import { sendMail } from "../middlewares/send.mail.js";
import moment from "moment";
import HistoryBooking from "../models/HistoryBooking.js";

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

    const maxAppointmentsPerSlot = 3;

    const existingAppointments = await Booking.find({ doctorId, date, timeTypeId });
    if (existingAppointments.length >= maxAppointmentsPerSlot && bookingType === "Online") {
      return res.status(400).json({ message: "Không còn chỗ trống trong khung giờ này." });
    }

    // const existingBooking = await Booking.findOne({ doctorId, date, timeTypeId });
    // if (existingBooking && bookingType === "Online") {
    //   return res.status(400).json({ message: "Cuộc hẹn trùng lặp." });
    // }
    const patient = await User.findById(patientId);

    const timeType = await TimeType.findById(timeTypeId);
    const servicesDetails = await SubService.find({ _id: { $in: service } });

    const newBooking = new Booking({
      patientId,
      doctorId,
      date,
      timeTypeId: timeType,
      description,
      service: servicesDetails,
      status,
      bookingType,
      setType,
      nameCustomer: nameCustomer || patient.name,
      numberPhoneCustomer: numberPhoneCustomer || patient.phone,
      emailCustomer: emailCustomer || patient.email,
      addressCustomer,
      genderCustomer,
      birthdayCustomer,
    });
    await newBooking.save();
    const servicesList = servicesDetails.map((service) => `<li>${service.name}</li>`).join("");
    await sendMail({
      email: newBooking.emailCustomer,
      subject: "Thông báo từ Phòng Khám Nha Khoa Tây Đô",
      html: `
      <h1 style="font-size: 24px; color: #333;"> Bạn đã đặt lịch thành công. Vui lòng kiểm tra lại thông tin lịch hẹn dưới đây</h1>
      <ul>
        <li style="font-size: larger;"> Tên bệnh nhân: ${newBooking.nameCustomer}  </li>
        <li style="font-size: larger;"> Ngày khám: ${moment(newBooking.date).format("DD/MM/YYYY")}  </li>
        <li style="font-size: larger;"> Giờ vào khám: ${timeType ? timeType.timeSlot : "Không xác định"}  </li>
        <li style="font-size: larger;"> Dịch vụ:
        <ul>
          ${servicesList}
        </ul>
      </li>
      </ul>
        <br><br><hr>
        <p style="color: gray; font-size: small;"><strong>From:</strong> Nha Khoa Tây Đô</p>
        <p style="color: gray; font-size: small;"><strong>Address:</strong> Tân Tây Đô, Đan Phượng, Hà Nội</p>
        <p style="color: gray; font-size: small;"><strong>Phonenumber:</strong> +84961106507</p>

      `,
    });

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
    const users = await User.find({ name: _filter?.name });
    const idUser = users.map((x) => {
      return x._id;
    });
    if (_filter?.name) {
      _filter.$or = [{ nameCustomer: _filter?.name }, { patientId: { $in: idUser } }];
      delete _filter.name;
    }
    const booking = await Booking.find(_filter)
      .populate("doctorId", "-password")
      .populate("patientId", "-password")
      .populate("timeTypeId")
      .populate("service")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(Sorts);
    const total = await Booking.find(_filter);
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

    if (!booking) {
      return res.status(404).json({ message: "Cuộc hẹn không tồn tại." });
    }

    if (status !== booking.status) {
      // Chỉ cập nhật thời gian nếu trạng thái thay đổi
      booking.status = status;
      if (statusUpdateTime) {
        booking.statusUpdateTime = statusUpdateTime;
      }

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
    const approvedBookings = await Booking.findById(Id)
      .populate("doctorId", "-password")
      .populate("patientId", "-password")
      .populate("timeTypeId")
      .populate("service");
    res.status(200).json(approvedBookings);
  } catch (err) {
    next(err);
  }
};

export const handleFinishedExamination = async (req, res, next) => {
  try {
    const id = req.params.id;
    const approvedBookings = await Booking.findById(id)
      .populate("doctorId", "-password")
      .populate("patientId", "-password")
      .populate("timeTypeId")
      .populate("service");

    const idService = approvedBookings?.service?.map((x) => x?._id);

    console.log("approvedBookings", approvedBookings);

    const item = {
      address: approvedBookings?.addressCustomer || approvedBookings?.patientId?.address,
      email: approvedBookings?.emailCustomer || approvedBookings?.patientId?.email,
      name: approvedBookings?.nameCustomer || approvedBookings?.patientId?.name,
      phone: approvedBookings?.numberPhoneCustomer || approvedBookings?.patientId?.phone,
      gender: approvedBookings?.genderCustomer || approvedBookings?.patientId?.gender,
      birthday: approvedBookings?.birthdayCustomer || approvedBookings?.patientId?.birthday,
      service: idService,
      doctorId: approvedBookings?.doctorId?._id,
      bookingType: approvedBookings?.bookingType,
    };
    console.log("item", item);
    await Booking.findOneAndUpdate({ _id: approvedBookings?.id }, { $set: { status: "Done" } }, { new: true });
    const _item = await new HistoryBooking({
      ...item,
    }).save();
    res.status(200).json(_item);
  } catch (err) {
    next(err);
  }
};
