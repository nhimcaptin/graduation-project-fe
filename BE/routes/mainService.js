import express from "express";
import { createMainService, deleteMainServices, getAllMainServices, getMainService, updateMainServices } from "../controllers/mainService.js";

const router = express.Router();

router.post("/create", createMainService);
router.get("/get/:id", getMainService);
router.get("/getAll", getAllMainServices);
router.put("/update/:id", updateMainServices);
router.delete("/delete/:id", deleteMainServices);


export default router