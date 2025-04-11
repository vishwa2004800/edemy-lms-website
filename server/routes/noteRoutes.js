
import express from "express"
// import { isAuthenticated } from "../middlewares/auth.js"
import Note from "../models/noteModel.js"

const router = express.Router()

// Get all notes for a course
router.get("/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params

    console.log("Request auth:", req.auth)
    console.log("Request headers:", req.headers)


    // const userId = req.user._id // Changed from req.user.id to req.user._id to match your auth structure
    const userId = req.auth.userId // Example ways Clerk might provide it


    const notes = await Note.find({ userId, courseId }).sort({ createdAt: -1 })

    // Return notes without trying to enhance with lecture names for now
    // This simplifies the implementation and removes potential errors
    return res.status(200).json({
      success: true,
      notes: notes,
    })
  } catch (error) {
    console.error("Error fetching notes:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    })
  }
})

// Add a new note
router.post("/add", async (req, res) => {
  try {
    const { courseId, lectureId, content, timestamp, lectureName } = req.body
    const userId = req.auth.userId 

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Note content is required",
      })
    }

    const newNote = await Note.create({
      userId,
      courseId,
      lectureId,
      lectureName,
      content,
      timestamp,
    })

    return res.status(201).json({
      success: true,
      message: "Note added successfully",
      note: newNote,
    })
  } catch (error) {
    console.error("Error adding note:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to add note",
    })
  }
})

// Update a note
router.put("/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params
    const { content } = req.body
    const userId = req.auth.userId// Changed from req.user.id to req.user._id

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Note content is required",
      })
    }

    const note = await Note.findById(noteId)

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      })
    }

    if (note.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this note",
      })
    }

    note.content = content
    await note.save()

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    })
  } catch (error) {
    console.error("Error updating note:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to update note",
    })
  }
})

// Delete a note
router.delete("/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params
    const userId = req.auth.userId // Changed from req.user.id to req.user._id

    const note = await Note.findById(noteId)

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      })
    }

    if (note.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this note",
      })
    }

    await Note.findByIdAndDelete(noteId)

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting note:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to delete note",
    })
  }
})

export default router
