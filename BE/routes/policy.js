import express from "express";
import { createPolicy, deletePolicy, getPolicy, updatePolicy } from "../controllers/policy.js";
const router = express.Router();

router.post("/create", createPolicy);
router.put("/updatePolicy/:id", updatePolicy);
router.get("/getPolicy", getPolicy);
router.delete("/deletePolicy/:id", deletePolicy);
export default router