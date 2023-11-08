import express from "express";
import { createNews } from "../controllers/news.js";

const router = express.Router();

router.post("/createNews", createNews);
// router.put("/updateDentalKnowledge/:id", updateDentalKnowledge);
// router.get("/getAllDentalKnowledge", getDentalKnowledge);
// router.delete("/deleteDentalKnowledge/:id", deleteDentalKnowledge);

export default router