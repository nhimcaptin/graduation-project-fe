import express from "express";
import {
  updateUser,
  deleteUser
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verifyToken.js";

const router = express.Router();


//UPDATE
router.put("/:id", verifyAdmin, updateUser);

//DELETE
router.delete("/:id", verifyAdmin , deleteUser);


export default router;
