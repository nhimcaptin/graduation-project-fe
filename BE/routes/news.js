import express from "express";
import { createNews, deleteNews, getNews, getNewsId, updateNews } from "../controllers/news.js";

const router = express.Router();

router.post("/createNews", createNews);
router.put("/updateNews/:id", updateNews);
router.get("/getNews", getNews);
router.delete("/deleteNews/:id", deleteNews);
router.get("/getNewsID/:id", getNewsId);

export default router