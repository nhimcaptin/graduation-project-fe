import express from "express";
import { createBooking, getBooking, getDetailBooking, updateBookingDetail, updateBookingStatus } from "../controllers/booking.js";

const router = express.Router();

router.post("/create", createBooking);
router.get("/detail-booking/:id", getDetailBooking);
router.get("/get-list", getBooking);
router.put("/update-status/:id", updateBookingStatus);
router.put("/update-detail/:id", updateBookingDetail)



export default router