import mongoose from "mongoose";
const SubServiceSchema = new mongoose.Schema(
  {
    mainServiceID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "MainService",
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      // chi phí
      type: String,
      require: true,
    },
    aesthetics: {
      // tính thẩm mỹ
      type: String,
      require: true,
    },
    treatmentTime: {
      // thời gian điều trị
      type: String,
      require: true,
    },
    examination: {
      // thăm khám
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
      require: true,
    },
    descriptionMain: {
      type: String,
      // require: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubService", SubServiceSchema);
