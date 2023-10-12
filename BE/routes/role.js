import express from "express";
import { verifyAdmin } from "../middlewares/verifyToken.js";
import { createRole, getDetailRole, getListRole, resourceActions, updateRole } from "../controllers/role.js";

const router = express.Router();

router.post("/create-role", createRole)
router.put("/edit-role", updateRole)
router.get("/resource-actions", resourceActions)
router.get("/get-detail", getDetailRole)
router.get("", getListRole)

export default router;
