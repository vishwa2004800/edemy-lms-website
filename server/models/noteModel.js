import mongoose from "mongoose"

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    courseId: {
      type: String, // Changed to String to match how courseId is used in the frontend
      required: true,
    },
    lectureId: {
      type: String,
      default: null,
    },
    lectureName:{
      type:String,
      // required:true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      // default: 0,
    },
  },
  { timestamps: true },
)

const Note = mongoose.model("Note", noteSchema)

export default Note
