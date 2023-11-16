import express from "express";
import {
  addPreferentialItem,
  createPreferential,
  deletePreferential,
  detailPreferential,
  getAllPreferentials,
  updatePreferential,
} from "../controllers/preferential.js";

const router = express.Router();

router.post("/create", createPreferential);
router.get("/detail/:id", detailPreferential);
router.put("/update/:id", updatePreferential);
router.delete("/delete/:id", deletePreferential);
router.post("/create-item/:id", addPreferentialItem);
router.get("/get", getAllPreferentials);

export default router;
