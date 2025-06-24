import multer from "multer";
import {
  createAttachment,
  getAttachmentById,
  deleteAttachment,
} from "../models/attachmentModel.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: "auto",
    });
const { lesson_id } = req.body; // Make sure lesson_id is sent from frontend

const attachmentDTO = {
  original_name: req.file.originalname,
  mime_type: req.file.mimetype,
  size: req.file.size,
  public_id: result.public_id,
  secure_url: result.secure_url,
  format: result.format,
  lesson_id: lesson_id ? parseInt(lesson_id) : null, // Ensure it's a number
};


    const attachment = await createAttachment(attachmentDTO);
    return res.status(201).json({ attachment }); 
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Error uploading file" });
  }
};

export const getFileById = async (req, res) => {
  try {
    const id = req.params.id;
    const attachment = await getAttachmentById(id);

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" }); 
    }

    return res.json(attachment); 
  } catch (error) {
    console.error("Get file error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const id = req.params.id;
    const attachment = await deleteAttachment(id);

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" }); 
    }

    return res.json({ message: "Attachment deleted", attachment }); 
  } catch (error) {
    console.error("Delete file error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
};