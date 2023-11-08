import express from "express";
import { createNews, updateNews } from "../controllers/news.js";

const router = express.Router();

router.post("/createNews", createNews);
router.put("/updateNews/:id", updateNews);
// router.get("/getAllDentalKnowledge", getDentalKnowledge);
// router.delete("/deleteDentalKnowledge/:id", deleteDentalKnowledge);

export default router