import express from "express";
import { verifyAdmin } from "../middlewares/verifyToken.js";
import { createRole, getDetailRole, resourceActions, updateRole } from "../controllers/role.js";

const router = express.Router();

router.post("/create-role", createRole)
router.post("/edit-role", updateRole)
router.get("/resource-actions", resourceActions)
router.get("/get-detail", getDetailRole)

export default router;
