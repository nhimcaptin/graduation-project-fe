import express from "express";
import { uploadFile } from "../controllers/uploadImage.js";
import { upload, uploadMultiple } from "../middlewares/multer.js";

const router = express.Router();

router.post("/upload-image",upload, uploadFile);


export default router