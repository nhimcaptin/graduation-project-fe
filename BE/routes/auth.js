import express from "express";
import {logout, login, register, sendPasswordLink, forgotPassword, resetPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login-web", login)
router.post("/login-admin", login)
router.post("/logout", logout)

router.post("/send-password-link", sendPasswordLink);

router.get("/forgot-password/:id/:token",forgotPassword)

router.post("/reset-password/:id/:token",resetPassword)

export default router