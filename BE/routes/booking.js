import express from "express";
import { createBooking, getBooking, getDetailBooking, getListApprovedBookings, getListCancelBookings, getListWaitingBookings, getUserAndBookings, updateBookingDetail, updateBookingStatus } from "../controllers/booking.js";

const router = express.Router();

router.post("/create", createBooking);
router.get("/detail-booking/:id", getDetailBooking);
router.get("/get-list", getBooking);
router.get("/get-list-approved-booking", getListApprovedBookings);
router.get("/get-list-cancel-booking", getListCancelBookings);
router.get("/get-list-waiting-booking", getListWaitingBookings);
router.get("/get-userBooking/:id", getUserAndBookings);
router.put("/update-status/:id", updateBookingStatus);
router.put("/update-detail/:id", updateBookingDetail)



export default router