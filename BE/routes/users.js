import express from "express";
import { updateUser, deleteUser, detailUser } from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verifyToken.js";
import { register } from "../controllers/auth.js";

const router = express.Router();

//CREATE
router.post("", register);

//UPDATE
router.put("/:id", verifyAdmin, updateUser);

//DETAIL
router.get("/:id", verifyAdmin, detailUser);

//DELETE
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
