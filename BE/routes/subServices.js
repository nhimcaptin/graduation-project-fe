import express from "express";
import { createSubService, deleteSubservice, detailSubservice, getAllServices, getSubservice, listSubSerViceForMain, updateSubservice } from "../controllers/subService.js";

const router = express.Router();

router.post("/create", createSubService);
router.put("/update/:id", updateSubservice);
router.delete("/delete/:id", deleteSubservice);
router.get("/getall", getSubservice);
router.get("/detailSubservice/:id", detailSubservice);
router.get("/get-services", getAllServices);
router.get("/getSubServicesForMainservie/:mainServiceID", listSubSerViceForMain);



export default router