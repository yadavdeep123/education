const express = require("express");
const Course = require("../models/Course");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/mine", auth(["instructor", "admin"]), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/", auth(["instructor", "admin"]), async (req, res) => {
  try {
    const { title, description, category, thumbnailUrl } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const course = await Course.create({
      title,
      description,
      category,
      thumbnailUrl,
      instructor: req.user.id,
      isPublished: true,
    });

    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/:id/lessons", auth(["instructor", "admin"]), async (req, res) => {
  try {
    const { title, description, videoUrl, duration } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({ message: "Title and videoUrl are required" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (String(course.instructor) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    course.lessons.push({
      title,
      description,
      videoUrl,
      duration: Number(duration || 0),
    });

    await course.save();

    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
