import express from "express";
import { createBooking, getBooking } from "../controllers/booking.js";

const router = express.Router();

router.post("/create", createBooking);
router.get("/detail-booking/:id", getBooking);


export default router