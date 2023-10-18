import mongoose from "mongoose";
const TimeTypeSchema = new mongoose.Schema(
  {
    timeSlot: { 
      type: String, 
      required: true,
      unique: true, 
    },
  }
);

export default mongoose.model("TimeType", TimeTypeSchema);
