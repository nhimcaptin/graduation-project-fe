import express from "express";
import { createBooking, getAllBoking, getBooking, updateBooking } from "../controllers/booking.js";

const router = express.Router();

router.post("/create", createBooking);
router.get("/detail-booking/:id", getBooking);
router.get("/detail-booking", getAllBoking);
router.get("/detail-booking/update/:id", updateBooking);


export default router