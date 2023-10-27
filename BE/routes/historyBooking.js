import express from "express";
import { addHistory, getListHistory } from "../controllers/historyBooking.js";

const router = express.Router();

router.post("/create", addHistory);
router.get("/get-list", getListHistory);

export default router;
