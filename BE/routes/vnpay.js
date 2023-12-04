import express from "express";
import { verifyAdmin } from "../middlewares/verifyToken.js";
import { createdUrl } from "../controllers/vnpay.js";

const router = express.Router();

//CREATE
router.post("/create_payment_url",  createdUrl);

export default router;
