
import express from "express"
import Discussion from "../models/discussionForum.js"

const discussionRouter = express.Router()

// 1. Get all discussions for a course
// GET /api/discussions/:courseId
discussionRouter.get("/api/discussions/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params
    const discussions = await Discussion.find({ courseId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate({
        path: "replies.userId",
        select: "name email",
      })

    res.status(200).json({
      success: true,
      discussions,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch discussions",
      error: error.message,
    })
  }
})

// 2. Create a new discussion
// POST /api/discussions/create
discussionRouter.post("/api/discussions/create", async (req, res) => {
  try {
    const { courseId, content } = req.body

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      })
    }

    const userId = req.auth.userId // Assuming auth middleware sets req.user

    const discussion = new Discussion({
      courseId,
      userId: userId,
      content,
      replies: [],
    })

    await discussion.save()
    const populatedDiscussion = await Discussion.findById(discussion._id).populate("userId", "name email")

    res.status(201).json({
      success: true,
      discussion: populatedDiscussion,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create discussion",
      error: error.message,
    })
  }
})

// 3. Update a discussion
// PUT /api/discussions/:discussionId
discussionRouter.put("/api/discussions/:discussionId", async (req, res) => {
  try {
    const { discussionId } = req.params
    const { content } = req.body
    const userId = req.auth.userId

    const discussion = await Discussion.findById(discussionId)

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      })
    }

    if (discussion.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this discussion",
      })
    }

    discussion.content = content
    discussion.updatedAt = Date.now()

    await discussion.save()

    res.status(200).json({
      success: true,
      message: "Discussion updated successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update discussion",
      error: error.message,
    })
  }
})

// 4. Delete a discussion
// DELETE /api/discussions/:discussionId
discussionRouter.delete("/api/discussions/:discussionId", async (req, res) => {
  try {
    const { discussionId } = req.params
    const userId = req.auth.userId

    const discussion = await Discussion.findById(discussionId)

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      })
    }

    if (discussion.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this discussion",
      })
    }

    await Discussion.findByIdAndDelete(discussionId)

    res.status(200).json({
      success: true,
      message: "Discussion deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete discussion",
      error: error.message,
    })
  }
})

// 5. Add a reply to a discussion
// POST /api/discussions/:discussionId/reply
discussionRouter.post("/api/discussions/:discussionId/reply", async (req, res) => {
  try {
    const { discussionId } = req.params
    const { content } = req.body
    const userId = req.auth.userId

    const discussion = await Discussion.findById(discussionId)

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      })
    }

    const reply = {
      userId: userId,
      content,
      createdAt: new Date(),
    }

    discussion.replies.push(reply)
    await discussion.save()

    const populatedDiscussion = await Discussion.findById(discussionId).populate("userId", "name email").populate({
      path: "replies.userId",
      select: "name email",
    })

    const newReply = populatedDiscussion.replies[populatedDiscussion.replies.length - 1]

    res.status(201).json({
      success: true,
      reply: newReply,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add reply",
      error: error.message,
    })
  }
})

export default discussionRouter
