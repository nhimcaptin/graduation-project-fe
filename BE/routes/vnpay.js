import express from "express";
import { verifyAdmin } from "../middlewares/verifyToken.js";
import { createdUrl, querydr, refund } from "../controllers/vnpay.js";

const router = express.Router();

//CREATE
router.post("/create_payment_url", createdUrl);
router.post("/querydr", querydr);
router.post("/refund", refund);

export default router;
