import mongoose from "mongoose";
const MainServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      require: true,
    },
    descriptionMain: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      default: "Inactive",
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MainService", MainServiceSchema);
