import express from "express";
import { createPolicy } from "../controllers/policy.js";
const router = express.Router();

router.post("/create", createPolicy);
// router.put("/updateNews/:id", updateNews);
// router.get("/getNews", getNews);
// router.delete("/deleteNews/:id", deleteNews);
export default router