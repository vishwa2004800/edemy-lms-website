// import express from 'express'
// import StudyPlan from '../models/studyPlan.js'
// import Course from '../models/Courses.js'
// import User from '../models/User.js'
// import sendEmail from '../utils/sendEmail.js' // adjust path as needed



// const router = express.Router()

// // Add study plan
// // router.post('/add', async (req, res) => {
// //   try {
// //     const { courseId, lectureId, scheduledDate } = req.body
// //     const userId = req.auth.userId

// //     // const plan = await StudyPlan.create({ userId, courseId, lectureId, scheduledDate })
// //     const newPlan = await StudyPlan.create({
// //       userId,
// //       courseId,
// //       lectureId,
// //       scheduledDate,
// //     })
// //     console.log('Created new plan:', newPlan)
    

// //     const user = await User.findById(userId)

// //     if (user?.email) {
// //       await sendEmail({
// //         to: user.email,
// //         subject: `Lecture Scheduled Successfully 📚`,
// //         html: `
// //           <h2>Hi ${user.name || ''}!</h2>
// //           <p>Your lecture <strong>${lectureName}</strong> has been successfully scheduled for <strong>${new Date(scheduledDate).toLocaleString()}</strong>.</p>
// //           <p><a href="https://calendar.google.com/calendar/u/0/r/eventedit" target="_blank">📅 Add to your calendar</a></p>
// //           <p>Happy studying!</p>
// //         `,
// //       })
// //     }

// //     return res.status(201).json({ success: true, plan })
// //   } catch (error) {
// //     console.error('Error adding study plan:', error)
// //     return res.status(500).json({ success: false, message: 'Failed to add study plan' })
// //   }
// // })

// router.post('/add', async (req, res) => {
//   try {
//     const { courseId, lectureId, scheduledDate } = req.body
//     const userId = req.auth.userId

//     const newPlan = await StudyPlan.create({
//       userId,
//       courseId,
//       lectureId,
//       scheduledDate,
//     })
//     console.log('Created new plan:', newPlan)

//     const user = await User.findById(userId)

//     let lectureName = 'your lecture'
//     const course = await Course.findById(courseId)
//     const lecture = course?.lectures?.find(lec => lec._id.toString() === lectureId)
//     if (lecture) {
//       lectureName = lecture.title
//     }

//     if (user?.email) {
//       await sendEmail({
//         to: user.email,
//         subject: `Lecture Scheduled Successfully 📚`,
//         html: `
//           <h2>Hi ${user.name || ''}!</h2>
//           <p>Your lecture <strong>${lectureName}</strong> has been successfully scheduled for <strong>${new Date(scheduledDate).toLocaleString()}</strong>.</p>
//           <p><a href="https://calendar.google.com/calendar/u/0/r/eventedit" target="_blank">📅 Add to your calendar</a></p>
//           <p>Happy studying!</p>
//         `,
//       })
//     }

//     return res.status(201).json({ success: true, plan: newPlan })
//   } catch (error) {
//     console.error('Error adding study plan:', error)
//     return res.status(500).json({ success: false, message: 'Failed to add study plan' })
//   }
// })


// // Get all user study plans
// router.get('/my-plans', async (req, res) => {
//   try {
//     const userId = req.auth.userId
//     const {courseId}  = req.query

//     const filter  = {userId}
//     if (courseId) filter.courseId = courseId
//     const plans = await StudyPlan.find(filter)
//       // .populate('lectureId')
//       .sort({ scheduledDate: 1 })

//     return res.status(200).json({ success: true, plans })
//   } catch (error) {
//     console.error('Error fetching study plans:', error)
//     return res.status(500).json({ success: false, message: 'Failed to fetch plans' })
//   }
// })

// export default router
import express from 'express'
import StudyPlan from '../models/studyPlan.js'
import Course from '../models/Courses.js'
import User from '../models/User.js'
import sendEmail from '../utils/sendEmail.js' // adjust path if needed

const router = express.Router()

router.post('/add', async (req, res) => {
  try {
    const { courseId, lectureId, scheduledDate } = req.body
    const userId = req.auth?.userId

    // Basic validation
    if (!userId || !courseId || !lectureId || !scheduledDate) {
      console.error('[ERROR] Missing required fields', { userId, courseId, lectureId, scheduledDate })
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    // Create new study plan
    const newPlan = await StudyPlan.create({
      userId,
      courseId,
      lectureId,
      scheduledDate,
    })
    console.log('[INFO] Created new plan:', newPlan)

    // Fetch user info
    const user = await User.findById(userId)
    if (!user) {
      console.error('[ERROR] User not found for ID:', userId)
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Fetch course and lecture title
    let lectureName = 'your lecture'
    const course = await Course.findById(courseId)
    if (course) {
      const lecture = course.lectures?.find(lec => lec._id.toString() === lectureId)
      if (lecture) {
        lectureName = lecture.title
      }
    }

    // Send email
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: `Lecture Scheduled Successfully 📚`,
        html: `
          <h2>Hi ${user.name || 'Student'}!</h2>
          <p>Your lecture <strong>${lectureName}</strong> has been successfully scheduled for <strong>${new Date(scheduledDate).toLocaleString()}</strong>.</p>
          <p><a href="https://calendar.google.com/calendar/u/0/r/eventedit" target="_blank">📅 Add to your calendar</a></p>
          <p>Happy studying!</p>
        `,
      })
      console.log(`[INFO] Email sent to ${user.email}`)
    }

    return res.status(201).json({ success: true, plan: newPlan })
  } catch (error) {
    console.error('[ERROR] Failed to add study plan:', error)
    return res.status(500).json({ success: false, message: 'Failed to add study plan' })
  }
})

// ✅ Get All Study Plans for a User (Optionally Filtered by Course)
router.get('/my-plans', async (req, res) => {
  try {
    const userId = req.auth?.userId
    const { courseId } = req.query

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const filter = { userId }
    if (courseId) filter.courseId = courseId

    const plans = await StudyPlan.find(filter)
      .sort({ scheduledDate: 1 })

    return res.status(200).json({ success: true, plans })
  } catch (error) {
    console.error('[ERROR] Failed to fetch study plans:', error)
    return res.status(500).json({ success: false, message: 'Failed to fetch plans' })
  }
})

export default router
