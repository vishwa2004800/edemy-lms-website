import mongoose from 'mongoose'
// import User from '../models/User.js'

const studyPlanSchema = new mongoose.Schema({
  userId: {
     String,
    },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lectureId: { String },
  scheduledDate: { type: Date, required: true },
}, { timestamps: true })

export default mongoose.model('StudyPlan', studyPlanSchema)
