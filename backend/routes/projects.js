import express from "express";
import multer from "multer";
import Project from "../models/Project.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for in-memory file storage (Buffer)
const storage = multer.memoryStorage(); // ✅ file stored in memory
const upload = multer({ storage });

// Get all projects for authenticated user
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

// Create new project
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

// Upload file to project and store it in MongoDB as a buffer
router.post(
  "/:id/upload",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    try {
      const project = await Project.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileData = {
        buffer: req.file.buffer, // ✅ actual file content
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
    const project = await Project.findOne({
      _id: req.params.id,
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

export default router;
