import mongoose from 'mongoose'
// import User from '../models/User.js'

const studyPlanSchema = new mongoose.Schema({
  userId: {
     type:String,
    },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lectureId: {type: mongoose.Schema.Types.ObjectId, required:true },
  scheduledDate: { type: Date, required: true },
}, { timestamps: true })

export default mongoose.model('StudyPlan', studyPlanSchema)
