import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
      // require: true
    },
    degree: {
      type: String,
      // require: true,
    },
    verifytoken:{
      type:String,
  },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
