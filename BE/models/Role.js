import mongoose from "mongoose";

const actionSchema = new mongoose.Schema({
  code: String,
  name: String,
});

const resourceSchema = new mongoose.Schema({
  code: String,
  name: String,
});

const permissionSchema = new mongoose.Schema({
  resource: resourceSchema,
  actions: [actionSchema],
});

const RoleSchema = new mongoose.Schema({
  roleId: { type: String, required: true, unique: true, immutable: true },
  name: { type: String, required: true, immutable: true },
  permissions: [permissionSchema],
});

export default mongoose.model("Role", RoleSchema);
