import moment from "moment";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const getDataDashboard = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.query;

    const Bookings = await Booking.find({
      status: "Done",
      statusUpdateTime: { $gte: new Date(fromDate), $lte: new Date(toDate) },
      service: { $ne: null },
    })
      .populate("service")
      .sort({ statusUpdateTime: 1 });

    const obj = {};
    Bookings.forEach((x) => {
      const { statusUpdateTime } = x;
      const id = moment(statusUpdateTime).format("DD-MM-YYYY");
      if (obj[id]) {
        obj[id].push(x._doc);
      } else {
        obj[id] = [{ ...x._doc }];
      }
    });

    let numberMax = 0;

    Object.keys(obj).forEach((key) => {
      if (obj[key].length > numberMax) {
        numberMax = obj[key].length;
      }
    });

    const item = {};
    Object.keys(obj).map((x, index) => {
      obj[x].forEach((y) => {
        const { service } = y;
        if (item[service?._id]) {
          item[service?._id].data[index] = Number(item[service?._id].data[index]) + 1;
          item[service?._id] = {
            name: service?.name,
            data: item[service?._id].data,
          };
        } else {
          const array = Array.from({ length: numberMax }, (_, _index) => {
            if (_index === index) return 1;
            return 0;
          });
          item[service?._id] = {
            name: service?.name,
            data: array,
          };
        }
      });
    });

    res.status(200).json({ item: Object.values(item), date: Object.keys(obj) });
  } catch (error) {
    next(error);
  }
};

export const getDataInformationDashboard = async (req, res, next) => {
  try {
    const countStaff = (await User.find({ role: { $ne: null } })).length;
    const countUser = (await User.find({ role: null })).length;
    const listUserMost7Day = await User.find({
      role: null,
      createdAt: { $gte: new Date(moment().subtract(6, "d")), $lte: new Date(moment()) },
    });
    res.status(200).json({ countStaff, countUser, listUserMost7Day });
  } catch (error) {
    next(error);
  }
};
