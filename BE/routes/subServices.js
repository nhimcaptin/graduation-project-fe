import express from "express";
import { createSubService, deleteSubservice, detailSubservice, getSubservice, updateSubservice } from "../controllers/subService.js";

const router = express.Router();

router.post("/create", createSubService);
router.put("/update/:id", updateSubservice);
router.delete("/delete/:id", deleteSubservice);
router.get("/getall", getSubservice);
router.get("/detailSubservice/:id", detailSubservice);


export default router