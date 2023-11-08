import express from "express";
import { uploadFile } from "../controllers/uploadImage.js";

const router = express.Router();

router.post("/upload-image", uploadFile);


export default router