import express from "express";
import { createDentalKnowledge, updateDentalKnowledge } from "../controllers/dental_knowledge.js";

const router = express.Router();

router.post("/create", createDentalKnowledge);
router.put("/updateDentalKnowledge/:id", updateDentalKnowledge);

export default router