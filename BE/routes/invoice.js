import express from "express";
import { createPdf, fetchPdf } from "../controllers/invoice.pdf.js";

const router = express.Router();

router.post("/create-pdf", createPdf);
router.post("/fetch-pdf", fetchPdf);

export default router;
