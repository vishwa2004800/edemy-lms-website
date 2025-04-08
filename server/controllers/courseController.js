
import Course from "../models/Courses.js";
// import Purchase from "../models/Purchase.js";

// Get All Courses
export const getAllCourse = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent','-enrolledStudents'])
            .populate({path:'educator'}); // Populate educator with name and imageUrl

        res.json({ success: true, courses });
    }
     catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Course by Id
export const getCourseId = async (req, res) => {
    const { id } = req.params;

    try {
        const courseData = await Course.findById(id)
            .populate({path:'educator'}); // Populate educator with name and imageUrl

        if (!courseData) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.json({ success: true, courseData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


