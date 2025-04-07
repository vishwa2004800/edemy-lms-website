import {clerkClient} from '@clerk/express'
import { requireAuth } from '@clerk/express';
import Course from '../models/Courses.js';
import { v2 as cloudinary } from 'cloudinary'



export const updateRoleToEducator = async(req,res)=>{
    try{
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata:{
                role:'educator',

            }
        })

        res.json({success:true, message:'You can publish a course now'})
    }

    catch(error){
        res.json({success:false,message:error.message})
    }
}
// Add New Course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' });
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        // add course model to database
        const newCourse =  await Course.create(parsedCourseData)
        const imgUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail=imgUpload.secure_url
        await newCourse.save()

        res.json({success: true, message: 'Course Added'})

    } catch (error) {

        res.json({success:false, message:error.message})

    }
}


// get all courses of instructor
export const getEducatorCourses = async (req, res) => {
    try {
      const educator = req.auth.userId;
      const courses = await Course.find({ educator });
      res.json({ success: true, courses });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };

  // get all the data of eductaor to display it in dashboard
  export const educatorDashboardData = async () => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.
        amount, 0);

        //collect student ids who enrolled in course of that particular educator
        const enrolledStudentsData = [];
        for(const course of courses){
            const students = await User.find({
                _id : {$in: course.enrolledStudents}

            }, 'name imageUrl')

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }

        res.json({success:true, dashboardData:{
            totalEarnings, enrolledStudentsData, totalCourses
        }})
    }
    catch(error)
    {

        res.json({success:false, message:error.message})

    }
}

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map(purchase  => ({
            student:purchase.userId,
            courseTitle:purchase.courseId.courseTitle,
            purchaseData:purchase.createdAt
        }));

        res.json({success:true, enrolledStudents})

    } catch (error) {
        res.json({success:false, message:error.message})

        
    }
};


