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
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubService",
      },
    ],
    totalAmount:{
      type: String,
    },
    statusPayment: {
      type: String,
      required: true,
      default: "Waiting",
    },
    bookingType: {
      type: String,
      default: "Online",
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  },
  { timestamps: true }
);

export default mongoose.model("HistoryBooking", HistoryBookingSchema);
