import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    rate: {
        type: String,
        required: true,
      },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
