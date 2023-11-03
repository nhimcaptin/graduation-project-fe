import express from "express";
import { addHistory, bookingReExamination, getDetailHistory, getListHistory } from "../controllers/historyBooking.js";

const router = express.Router();

router.post("/create", addHistory);
router.get("/get-list", getListHistory);
router.get("/get-detail/:id", getDetailHistory);
router.post("/update/:id", bookingReExamination);

export default router;
