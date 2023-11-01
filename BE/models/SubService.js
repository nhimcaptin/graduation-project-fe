import mongoose from "mongoose";
const SubServiceSchema = new mongoose.Schema(
  {  
    mainServiceID: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    price: { // chi phí
        type: String,
        require: true
    },
    aesthetics: { // tính thẩm mỹ
      type: String,
      require: true
    },
    treatmentTime: { // thời gian điều trị
      type: String,
      require: true
    },
    examination: { // thăm khám
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
