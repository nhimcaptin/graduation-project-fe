import express from "express";
import { verifyAdmin } from "../middlewares/verifyToken.js";
import { createRole } from "../controllers/role.js";

const router = express.Router();

router.post("/create-role", createRole)

export default router;
