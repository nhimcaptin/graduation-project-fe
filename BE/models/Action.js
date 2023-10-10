import mongoose from "mongoose";

const ActionSchema = new mongoose.Schema({
  code: String,
  name: String,
});

export default mongoose.model("Action", ActionSchema);
