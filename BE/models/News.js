import mongoose from "mongoose";
const NewsSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    description: {
      type: String,
      require: true
    },
    
    image: {
        type: String
      }
  },
  { timestamps: true }
);

export default mongoose.model("News", NewsSchema);
