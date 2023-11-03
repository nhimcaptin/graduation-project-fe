import express from "express";
import { addHistory, getDetailHistory, getListHistory } from "../controllers/historyBooking.js";

const router = express.Router();

router.post("/create", addHistory);
router.get("/get-list", getListHistory);
router.get("/get-detail/:id", getDetailHistory);

export default router;
