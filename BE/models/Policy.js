import mongoose from "mongoose";

const PolicyItemSchema = new mongoose.Schema({
  classify: { //phân loại
    type: String,
    required: true
  },
  description: { 
    type: String,
    required: true
  }
});

const PolicySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    items: [PolicyItemSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Policy", PolicySchema);
