import express from "express";
import { uploadFile, uploadMultipleImages } from "../controllers/uploadImage.js";
import { upload, uploadMultiple } from "../middlewares/multer.js";

const router = express.Router();

router.post("/upload-image", uploadFile);


export default router