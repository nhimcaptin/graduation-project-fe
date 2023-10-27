import mongoose from "mongoose";
const HistoryBookingSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    condition: {
      type: String,
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
