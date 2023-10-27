import express from "express";
import { creatSubservice, deleteSubservice, getSubservice, updateSubservice } from "../controllers/subService.js";

const router = express.Router();

router.post("/create/:id", creatSubservice);
router.put("/updateSubService/:id", updateSubservice);
router.delete("/deleteSubservice/:id", deleteSubservice);
router.get("/getallSubService", getSubservice);


export default router