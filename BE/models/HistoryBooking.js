import mongoose from "mongoose";
const HistoryBookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    birthday: {
      type: String,
    },
    date: {
      type: Date,
    },
    condition: {
      type: String,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainService",
    },
    bookingType: {
      type: String,
      default: "Online",
    },
  },
  { timestamps: true }
);

export default mongoose.model("HistoryBooking", HistoryBookingSchema);
