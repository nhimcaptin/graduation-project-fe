import mongoose from "mongoose";
const ServiceSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    description: {
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

export default mongoose.model("Service", ServiceSchema);
