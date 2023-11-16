import express from "express";
import { getDataDashboard } from "../controllers/dashboard.js";

const router = express.Router();

router.get("", getDataDashboard);

export default router;
