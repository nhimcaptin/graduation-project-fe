import express from "express";
import { createBooking, getAllBoking, getBooking } from "../controllers/booking.js";

const router = express.Router();

router.post("/create", createBooking);
router.get("/detail-booking/:id", getBooking);
router.get("/detail-booking", getAllBoking);


export default router