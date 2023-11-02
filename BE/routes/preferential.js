import express from "express";
import { addPreferentialItem, createPreferential, getAllPreferentials } from "../controllers/preferential.js";

const router = express.Router();

router.post("/create", createPreferential);
router.post("/create-item/:id", addPreferentialItem);
router.get("/get", getAllPreferentials);



export default router