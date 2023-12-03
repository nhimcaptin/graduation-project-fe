import express from "express";
import { createComment, deleteCmtAdmin, deleteComment, getCommentsByDoctorId } from "../controllers/comment.js";
import {  verifyUser } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create",verifyUser,createComment);
router.get("/get/:id", getCommentsByDoctorId);
router.delete("/delete/:id",verifyUser, deleteComment);

router.delete("/admin-delete/:id", deleteCmtAdmin);



export default router