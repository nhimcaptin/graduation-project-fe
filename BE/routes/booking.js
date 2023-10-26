import express from "express";
import { createBooking, getBooking, getDetailBooking } from "../controllers/booking.js";

const router = express.Router();

router.post("/create", createBooking);
router.get("/detail-booking/:id", getDetailBooking);
router.get("/get-list", getBooking);


export default router