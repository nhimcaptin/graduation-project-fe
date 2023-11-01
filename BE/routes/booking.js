import express from "express";
import { createBooking, getBooking, getDetailBooking, getDetailComeCheck, getListApprovedBookings, getListCancelBookings, getListDoneBookings, getListWaitingAndReExaminationBookings, getUserAndBookings, updateBookingDetail, updateBookingStatus } from "../controllers/booking.js";

const router = express.Router();

router.post("/create", createBooking);
router.get("/detail-booking/:id", getDetailBooking);
router.get("/get-list", getBooking);
router.get("/get-list-approved-booking", getListApprovedBookings);
router.get("/get-list-cancel-booking", getListCancelBookings);
router.get("/get-list-done-booking", getListDoneBookings);
router.get("/get-list-waiting-booking", getListWaitingAndReExaminationBookings);
router.get("/get-userBooking/:id", getUserAndBookings);
router.put("/update-status/:id", updateBookingStatus);
router.put("/update-detail/:id", updateBookingDetail);
router.get("/get-detail-come-check/:id", getDetailComeCheck)



export default router