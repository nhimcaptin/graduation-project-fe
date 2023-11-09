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
    const historyDetail = await HistoryBooking.findById(id)
      .populate("doctorId", "-password")
      .populate("service")
      .populate({
        path: "bookingId",
        populate: {
          path: "timeTypeId",
          model: "TimeType",
        },
      });

    let isDisabled = false;
    if (historyDetail.bookingId.status === "Approved") {
      isDisabled = true;
    }
    res.status(200).json({ data: historyDetail, isDisabled });
  } catch (err) {
    next(err);
  }
};

export const bookingReExamination = async (req, res, next) => {
  try {
    const data = req.body;
    const id = req.params.id;
    let idBooking;

    if (data?.isCheck && !data?.bookingId) {
      const newBooking = new Booking({
        patientId: data?.patientId,
        doctorId: data?.idDoctor,
        date: data?.date,
        timeTypeId: data?.timeTypeId,
        description: data?.description,
        service: data?.idService,
        bookingType: data?.bookingType,
        setType: "ReExamination",
        nameCustomer: data?.name,
        birthdayCustomer: data?.birthday,
        numberPhoneCustomer: data?.phone,
        emailCustomer: data?.email,
        genderCustomer: data?.gender,
        addressCustomer: data?.address,
      });
      const { _id } = await newBooking.save();
      idBooking = _id;
    }

    if (data?.bookingId) {
      await Booking.findOneAndUpdate({ _id: data?.bookingId }, { $set: { status: "Cancel" } }, { new: true });
    }

    await HistoryBooking.findOneAndUpdate(
      { _id: id },
      { $set: { condition: data?.condition, bookingId: idBooking } },
      { new: true }
    );
    res.status(200).json("SUCCESS");
  } catch (err) {
    next(err);
  }
};
