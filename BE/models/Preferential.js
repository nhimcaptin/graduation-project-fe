import mongoose from "mongoose";

const PreferentialItemSchema = new mongoose.Schema({
  classify: { //phân loại
    type: String,
    required: true
  },
  discountAmount: { //tiết kiệm thêm 
    type: String,
    required: true
  },
  allInPrice: { //giá trọn bộ
    type: String,
    required: true
  },
  origin: { //xuất xứ
    type: String,
    required: true
  },
  guarantee: { //bảo hành
    type: String,
    required: true
  }
});

const PreferentialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    items: [PreferentialItemSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Preferential", PreferentialSchema);
