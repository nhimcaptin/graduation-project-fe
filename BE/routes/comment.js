import express from "express";
import { createComment, deleteCmtAdmin, deleteComment, getComments, getCommentsByDoctorId } from "../controllers/comment.js";
import {  verifyUser } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create",verifyUser,createComment);
router.get("/get/:id", getCommentsByDoctorId);
router.delete("/delete/:id",verifyUser, deleteComment);
router.get("/getComments", getComments);
router.delete("/admin-delete/:id", deleteCmtAdmin);



export default router