import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Configuring multer for in-memory file storage (Buffer)
const storage = multer.memoryStorage(); // file stored in memory
const upload = multer({ storage });

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get("/", authenticate, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { name } = req.body;

    const project = new Project({
      name,
      userId: req.user._id,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post(
  "/:id/upload",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    try {
      const projectId = req.params.id;

      if (!isValidObjectId(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const project = await Project.findOne({
        _id: projectId,
        userId: req.user._id,
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileData = {
        buffer: req.file.buffer, // actual file content
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        uploadDate: new Date(),
      };

      project.files.push(fileData);
      await project.save();

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get single project
router.get("/:id", authenticate, async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findOne({
      _id: projectId,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// View/Download a file
router.get("/:projectId/files/:fileId", authenticate, async (req, res) => {
  try {
    const { projectId, fileId } = req.params;

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    if (!isValidObjectId(fileId)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    console.log("Viewing file:", fileId, "from project:", projectId);

    const project = await Project.findOne({
      _id: projectId,
      userId: req.user._id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const file = project.files.id(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.set({
      "Content-Type": file.fileType,
      "Content-Disposition": `inline; filename="${file.originalName}"`,
    });
    res.send(file.buffer);
  } catch (error) {
    console.error("View file error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a file from project
router.delete("/:projectId/files/:fileId", authenticate, async (req, res) => {
  try {
    const { projectId, fileId } = req.params;

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    if (!isValidObjectId(fileId)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    console.log("Deleting file:", fileId, "from project:", projectId);

    const project = await Project.findOne({
      _id: projectId,
      userId: req.user._id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const file = project.files.id(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    file.remove();
    await project.save();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
