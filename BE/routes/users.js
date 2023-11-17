import express from "express";
import { createUser, deleteUser, detailDoctor, detailUser, getCurrentUser, getListDoctors, getListUser, updateUser } from "../controllers/user.js";
import { verifyAdmin } from "../middlewares/verifyToken.js";

const router = express.Router();

//CREATE
router.post("", verifyAdmin, createUser);

//UPDATE
router.put("/:id", verifyAdmin, updateUser);

//GET-DETAIL
router.get("/detail/:id", verifyAdmin, detailUser);

//DELETE
router.delete("/:id", verifyAdmin, deleteUser);

//GET-CURRENT-USER
router.get("/get-current-user", getCurrentUser);

//GET-LIST-USER
router.get("/get-list", verifyAdmin, getListUser);

//GET-LIST-DOCTOR
router.get("/get-list-doctor", getListDoctors);

//GET-DETAIL-DOCTOR
router.get("/detail-doctor/:id", detailDoctor);

export default router;
