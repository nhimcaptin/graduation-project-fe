import express from "express";
import { addHistory, bookingReExamination, getDetailHistory, getListHistory, getListHistoryUser, onPrint } from "../controllers/historyBooking.js";

const router = express.Router();

router.post("/create", addHistory);
router.get("/get-list", getListHistory);
router.get("/get-list-history-user", getListHistoryUser);
router.get("/get-detail/:id", getDetailHistory);
router.get("/print/:id", onPrint);
router.post("/update/:id", bookingReExamination);

export default router;
