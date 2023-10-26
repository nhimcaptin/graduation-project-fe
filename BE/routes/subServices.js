import express from "express";
import { creatSubservice, updateSubservice } from "../controllers/subService.js";

const router = express.Router();

router.post("/create/:id", creatSubservice);
router.put("/updateSubService/:id", updateSubservice);


export default router