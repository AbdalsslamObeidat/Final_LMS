import express from "express";
import multer from "multer";
import { uploadFile, getFileById, deleteFile } from "../controllers/uploadController.js";

const router = express.Router();
const storage = multer.memoryStorage(); // using memory storage for Cloudinary
const upload = multer({ storage }); // ready to parse file

// 👇 Apply multer middleware to the POST route
router.post("/", upload.single("file"), uploadFile);

router.get("/file/:id", getFileById);
router.delete("/file/:id", deleteFile);

export default router;