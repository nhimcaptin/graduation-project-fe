import express from "express";
import { getDataDashboard, getDataInformationDashboard } from "../controllers/dashboard.js";

const router = express.Router();

router.get("", getDataDashboard);
router.get("/data-information", getDataInformationDashboard);

export default router;
