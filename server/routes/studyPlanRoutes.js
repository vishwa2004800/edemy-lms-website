import express from 'express'
import StudyPlan from '../models/studyPlan.js'

const router = express.Router()

// Add study plan
router.post('/add', async (req, res) => {
  try {
    const { courseId, lectureId, scheduledDate } = req.body
    const userId = req.auth.userId

    const plan = await StudyPlan.create({ userId, courseId, lectureId, scheduledDate })

    return res.status(201).json({ success: true, plan })
  } catch (error) {
    console.error('Error adding study plan:', error)
    return res.status(500).json({ success: false, message: 'Failed to add study plan' })
  }
})

// Get all user study plans
router.get('/my-plans', async (req, res) => {
  try {
    const userId = req.auth.userId
    const plans = await StudyPlan.find({ userId })
      .populate('lectureId')
      .sort({ scheduledDate: 1 })

    return res.status(200).json({ success: true, plans })
  } catch (error) {
    console.error('Error fetching study plans:', error)
    return res.status(500).json({ success: false, message: 'Failed to fetch plans' })
  }
})

export default router
