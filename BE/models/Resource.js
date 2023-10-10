import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  code: String,
  name: String,
});

export default mongoose.model("Resource", ResourceSchema);
