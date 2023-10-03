import express from "express";
import { createUser, deleteUser, detailUser, updateUser } from "../controllers/user.js";
import { verifyAdmin } from "../middlewares/verifyToken.js";

const router = express.Router();

//CREATE
router.post("", verifyAdmin, createUser);

//UPDATE
router.put("/:id", verifyAdmin, updateUser);

//DETAIL
router.get("/:id", verifyAdmin, detailUser);

//DELETE
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
