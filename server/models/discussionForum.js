import mongoose from 'mongoose'
const replySchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const discussionSchema = new mongoose.Schema({
  courseId: {
    type: String,
    // ref: "Course",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  replies: [replySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// export default mongoose.model("Discussion", discussionSchema)
export default mongoose.models.Discussion || mongoose.model("Discussion", discussionSchema)
