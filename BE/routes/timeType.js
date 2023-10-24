import express from "express";
import { createTimeType } from "../controllers/timeType.js";

const router = express.Router();

router.post("/create", createTimeType);

export default router