import express from "express";
import { createMainService, getMainService } from "../controllers/mainService.js";

const router = express.Router();

router.post("/create", createMainService);


export default router