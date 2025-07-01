import CourseModel from "../models/courseModel.js";

const CourseController = {
  async create(req, res) {
    console.log("Course create req.body:", req.body); // Debug log
    const {
      title,
      description,
      instructor_id,
      category_id,
      thumbnail_url,
    } = req.body;
    if (
      !title ||
      !description ||
      !instructor_id ||
      !category_id ||
      !thumbnail_url
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
      console.log('GET /api/courses/getall called with query:', req.query);
      
      const filters = {};
      if (req.query.instructor_id) {
        console.log('Filtering by instructor_id:', req.query.instructor_id);
        filters.instructor_id = parseInt(req.query.instructor_id, 10);
        if (isNaN(filters.instructor_id)) {
          console.error('Invalid instructor_id format:', req.query.instructor_id);
          return res.status(400).json({ 
            success: false, 
            message: 'Invalid instructor_id format. Must be a number.' 
          });
        }
      }
      
      console.log('Using filters:', filters);
      const courses = await CourseModel.findAll(filters);
      
      console.log(`Found ${courses.length} courses with filters:`, filters);
      if (courses.length > 0) {
        console.log('First course sample:', {
          id: courses[0].id,
          title: courses[0].title,
          instructor_id: courses[0].instructor_id,
          is_published: courses[0].is_published,
          is_approved: courses[0].is_approved
        });
      }
      
      res.json({ success: true, courses });
    } catch (error) {
      console.error("Fetch courses error:", error);
      res.status(500).json({ 
        success: false, 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
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
      const { title, description, thumbnail_url, category_id } = req.body;

      // Allow partial updates, including category_id
      const updatedCourse = await CourseModel.update(courseId, {
        title,
        description,
        thumbnail_url,
        category_id,
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
