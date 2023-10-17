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
      required: true 
    },

    timeType: {
      type: String,
      require: true
    },

    description:{
      type: String,
    },
    service:{
      type: String
    },
    status:{
      type: String,
      required: true,
      default: "Waiting",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
