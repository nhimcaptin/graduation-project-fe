import express from "express";
import { getDataCountDashboard, getDataDashboard, getDataInformationDashboard } from "../controllers/dashboard.js";

const router = express.Router();

router.get("", getDataDashboard);
router.get("/count", getDataCountDashboard);
router.get("/data-information", getDataInformationDashboard);

export default router;
