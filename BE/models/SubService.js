import mongoose from "mongoose";
const SubServiceSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    price: {
        type: String,
        require: true
    },
    description: {
      type: String,
      require: true
    },
    image:{
        type: String
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubService", SubServiceSchema);
