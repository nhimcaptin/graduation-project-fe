import express from "express";
import { creatSubservice } from "../controllers/subService.js";

const router = express.Router();

router.post("/create/:id", creatSubservice);


export default router