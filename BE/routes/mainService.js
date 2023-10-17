import express from "express";
import { createMainService, getAllMainServices, getMainService } from "../controllers/mainService.js";

const router = express.Router();

router.post("/create", createMainService);
router.get("/get/:id", getMainService);
router.get("/getAll", getAllMainServices);


export default router