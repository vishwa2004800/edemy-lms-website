import { useState } from "react"
import { toast } from "react-toastify"
import { formatDistanceToNow } from "date-fns"

const DiscussionForum = () => {
  const [discussions, setDiscussions] = useState([]) // Simulate discussions state
  const [newComment, setNewComment] = useState("")
  const [replyText, setReplyText] = useState({})
  const [replyingTo, setReplyingTo] = useState(null)
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Post a new comment
  const handlePostComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const newDiscussion = {
      _id: Math.random().toString(36).substring(7), // Unique ID
      user: { name: "Anonymous" },
      content: newComment,
      createdAt: new Date(),
      replies: [],
    }

    setDiscussions([newDiscussion, ...discussions])
    setNewComment("")
    toast.success("Comment posted successfully")
  }

  // Post a reply to a comment
  const handlePostReply = (commentId) => {
    if (!replyText[commentId]?.trim()) return

    const updatedDiscussions = discussions.map((discussion) => {
      if (discussion._id === commentId) {
        return {
          ...discussion,
          replies: [
            ...discussion.replies,
            {
              _id: Math.random().toString(36).substring(7),
              user: { name: "Anonymous" },
              content: replyText[commentId],
              createdAt: new Date(),
            },
          ],
        }
      }
      return discussion
    })

    setDiscussions(updatedDiscussions)
    setReplyText({ ...replyText, [commentId]: "" })
    setReplyingTo(null)
    toast.success("Reply posted successfully")
  }

  // Edit a comment
  const handleEditComment = (commentId) => {
    if (!editText.trim()) return

    const updatedDiscussions = discussions.map((discussion) => {
      if (discussion._id === commentId) {
        return {
          ...discussion,
          content: editText,
          updatedAt: new Date(),
        }
      }
      return discussion
    })

    setDiscussions(updatedDiscussions)
    setEditingComment(null)
    setEditText("")
    toast.success("Comment updated successfully")
  }

  // Delete a comment
  const handleDeleteComment = (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return

    const updatedDiscussions = discussions.filter(
      (discussion) => discussion._id !== commentId
    )

    setDiscussions(updatedDiscussions)
    toast.success("Comment deleted successfully")
  }

  // Start editing a comment
  const startEditing = (comment) => {
    setEditingComment(comment._id)
    setEditText(comment.content)
  }

  // Toggle reply form
  const toggleReplyForm = (commentId) => {
    if (replyingTo === commentId) {
      setReplyingTo(null)
    } else {
      setReplyingTo(commentId)
      if (!replyText[commentId]) {
        setReplyText({ ...replyText, [commentId]: "" })
      }
    }
  }

  return (
    <div className="mt-10 border-t pt-8">
      <h2 className="text-2xl font-semibold mb-6">Discussion Forum</h2>

      {/* New comment form */}
      <div className="mb-8">
        <form onSubmit={handlePostComment} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Post Comment
          </button>
        </form>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading discussions...</p>
          </div>
        ) : discussions.length > 0 ? (
          discussions.map((comment) => (
            <div key={comment._id} className="border rounded-lg p-4 space-y-3">
              {/* Comment header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {comment.user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{"Vishwa Parmar"}</p>
                    <p className="text-gray-500 text-sm">
                      {comment.createdAt &&
                        formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {/* Edit/Delete options */}
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(comment)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Comment content */}
              {editingComment === comment._id ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditComment(comment._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingComment(null)}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800">{comment.content}</p>
              )}

              {/* Reply button */}
              <div>
                <button
                  onClick={() => toggleReplyForm(comment._id)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {replyingTo === comment._id ? "Cancel Reply" : "Reply"}
                </button>
              </div>

              {/* Reply form */}
              {replyingTo === comment._id && (
                <div className="pl-5 border-l-2 border-gray-200 space-y-2">
                  <textarea
                    value={replyText[comment._id] || ""}
                    onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                    placeholder="Write your reply..."
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => handlePostReply(comment._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Post Reply
                  </button>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="pl-5 border-l-2 border-gray-200 space-y-4 mt-4">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="space-y-1">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-sm">
                              {reply.user?.name?.charAt(0) || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{ "Vishwa Parmar"}</p>
                            <p className="text-gray-500 text-xs">
                              {reply.createdAt &&
                                formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-800 text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">No discussions yet. Be the first to start a conversation!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscussionForum
