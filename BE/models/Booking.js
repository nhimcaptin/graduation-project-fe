import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema(
  {
    setType: {
      type: String,
      default: "SetYourself"
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    addressCustomer: {
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
    service: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubService",
    }],
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
