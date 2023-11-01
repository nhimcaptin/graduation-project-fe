import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema(
  {
    setType: {
      type: String,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nameCustomer: {
      type: String,
    },
    birthdayCustomer: {
      type: Date,
    },
    numberPhoneCustomer: {
      type: String,
    },
    emailCustomer: {
      type: String,
    },
    genderCustomer: {
      type: String,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
    },
    timeTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TimeType",
    },
    description: {
      type: String,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainService",
    },
    status: {
      type: String,
      required: true,
      default: "Waiting",
    },
    bookingType: {
      type: String,
      default: "Online",
    },
    statusUpdateTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
