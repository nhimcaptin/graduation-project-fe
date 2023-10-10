import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  roleName: String,
  description: String,
  permissions: [
    {
      resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
      actions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Action" }],
    },
  ],
});

export default mongoose.model("Role", RoleSchema);
