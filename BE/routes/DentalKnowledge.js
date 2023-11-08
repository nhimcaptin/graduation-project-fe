import express from "express";
import { createDentalKnowledge, deleteDentalKnowledge, getDentalKnowledge, updateDentalKnowledge } from "../controllers/dental_knowledge.js";

const router = express.Router();

router.post("/create", createDentalKnowledge);
router.put("/updateDentalKnowledge/:id", updateDentalKnowledge);
router.get("/getAllDentalKnowledge", getDentalKnowledge);
router.delete("/deleteDentalKnowledge/:id", deleteDentalKnowledge);

export default router