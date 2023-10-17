import mongoose from "mongoose";
const MainServiceSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    description: {
      type: String,
      require: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("MainService", MainServiceSchema);
