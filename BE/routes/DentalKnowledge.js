import express from "express";
import { createDentalKnowledge, deleteDentalKnowledge, getDentalKnowledge, getKnowledgeId, updateDentalKnowledge } from "../controllers/dental_knowledge.js";

const router = express.Router();

router.post("/create", createDentalKnowledge);
router.put("/updateDentalKnowledge/:id", updateDentalKnowledge);
router.get("/getAllDentalKnowledge", getDentalKnowledge);
router.delete("/deleteDentalKnowledge/:id", deleteDentalKnowledge);
router.get("/getDetailDentalKnowledge/:id", getKnowledgeId);

export default router