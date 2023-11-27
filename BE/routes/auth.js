import express from "express";
import {logout, login, register, sendPasswordLink, forgotPassword, resetPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login-web", login)
router.post("/login-admin", login)
router.post("/logout", logout)

router.post("/sendpasswordlink", sendPasswordLink);

router.get("/forgotpassword/:id/:token",forgotPassword)

router.post("/resetpassword/:id/:token",resetPassword)

export default router