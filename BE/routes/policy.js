import express from "express";
import { createPolicy, deletePolicy, getPolicy, getPolicyId, updatePolicy } from "../controllers/policy.js";
const router = express.Router();

router.post("/create", createPolicy);
router.put("/updatePolicy/:id", updatePolicy);
router.get("/getPolicy", getPolicy);
router.delete("/deletePolicy/:id", deletePolicy);
router.get("/getPolicyID/:id", getPolicyId);
export default router