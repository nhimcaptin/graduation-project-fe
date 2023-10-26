import express from "express";
import { createTimeType, getListTimeTypes } from "../controllers/timeType.js";

const router = express.Router();

router.post("/create", createTimeType);
router.get("/get-list", getListTimeTypes);

export default router