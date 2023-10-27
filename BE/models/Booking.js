import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema(
  {
    patientId: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'User', 
      required: true 
    },
    doctorId: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'User', 
      required: true 
    },
    date: { 
      type: Date, 
    },
    timeTypeId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'TimeType', 
    },
    description:{
      type: String,
    },
    service:{
      type: mongoose.Schema.Types.ObjectId, ref: 'MainService',
    },
    status:{
      type: String,
      required: true,
      default: "Waiting",
    },
    bookingType:{
      type: String,
      default: "Online",
    },
    statusUpdateTime:{
      type: Date,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
