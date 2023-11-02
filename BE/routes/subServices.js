import express from "express";
import { createSubService, deleteSubservice, getSubservice, updateSubservice } from "../controllers/subService.js";

const router = express.Router();

router.post("/create", createSubService);
router.put("/update/:id", updateSubservice);
router.delete("/delete/:id", deleteSubservice);
router.get("/getall", getSubservice);


export default router