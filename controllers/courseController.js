import CourseModel from "../models/courseModel.js";

const CourseController = {
  async create(req, res) {
    const {
      title,
      description,
      instructor_id,
      category_id,
      thumbnail_url,
      is_published,
      is_approved,
    } = req.body;
    if (
      !title ||
      !description ||
      !instructor_id ||
      !category_id ||
      !thumbnail_url ||
      is_published === undefined ||
      is_approved === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    try {
      const course = await CourseModel.create({
        title,
        description,
        instructor_id,
        category_id,
        thumbnail_url,
        is_published: false, // Default to false until published by admin
        is_approved: false, // Default to false until approved by admin
      });
      res.status(201).json({ success: true, course });
    } catch (error) {
      console.error("Create course error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const courses = await CourseModel.findAll();
      res.json({ success: true, courses });
    } catch (error) {
      console.error("Fetch courses error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const course = await CourseModel.findById(req.params.id);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }
      res.json({ success: true, course });
    } catch (error) {
      console.error("Fetch course error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const courseId = req.params.id;
      const { title, description, thumbnail_url } = req.body;

      // Allow partial updates
      const updatedCourse = await CourseModel.update(courseId, {
        title,
        description,
        thumbnail_url,
      });

      if (!updatedCourse) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Course not found or update failed",
          });
      }

      res.json({ success: true, course: updatedCourse });
    } catch (error) {
      console.error("Update course error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deletedCourse = await CourseModel.delete(req.params.id);

      if (!deletedCourse) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Course not found or already deleted",
          });
      }

      res.json({
        success: true,
        message: "Course deleted successfully",
        course: deletedCourse,
      });
    } catch (error) {
      console.error("Delete course error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async approveOrReject(req, res) {
    try {
      const courseId = req.params.id;
      const { is_approved } = req.body;

      if (typeof is_approved !== "boolean") {
        return res
          .status(400)
          .json({
            success: false,
            message: "is_approved must be true or false",
          });
      }

      const updatedCourse = await CourseModel.updateApprovalStatus(
        courseId,
        is_approved
      );

      if (!updatedCourse) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }

      res.json({
        success: true,
        message: `Course has been ${is_approved ? "approved" : "rejected"}`,
        course: updatedCourse,
      });
    } catch (error) {
      console.error("Approve/reject course error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getPendingCourses(req, res) {
    try {
      const pendingCourses = await CourseModel.findPending();
      res.json({ success: true, courses: pendingCourses });
    } catch (error) {
      console.error("Fetch pending courses error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async publishOrUnpublish(req, res) {
    try {
      const courseId = req.params.id;
      const { isPublished } = req.body;

      if (typeof isPublished !== "boolean") {
        return res
          .status(400)
          .json({
            success: false,
            message: "isPublished must be true or false",
          });
      }

      const updatedCourse = await CourseModel.updatePublishStatus(
        courseId,
        isPublished
      );

      if (!updatedCourse) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }

      res.json({
        success: true,
        message: `Course has been ${isPublished ? "published" : "unpublished"}`,
        course: updatedCourse,
      });
    } catch (error) {
      console.error("Publish/unpublish course error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default CourseController;
