import { useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"

const PostModal = ({ post, onClose, onUpdatePost }) => {
  const currentUser = useSelector((store) => store.user)

  const [likes, setLikes] = useState(post.likes || [])
  const [comments, setComments] = useState(post.comments || [])
  const [commentText, setCommentText] = useState("")
  const [likeLoading, setLikeLoading] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)

  const isLiked = likes.includes(currentUser?._id)

  const handleLikeToggle = async () => {
    setLikeLoading(true)
    try {
      await axios.patch(
        import.meta.env.VITE_BACKEND_URL + `/post/like/${post._id}`,
        {},
        { withCredentials: true }
      )

      const updatedLikes = isLiked
        ? likes.filter((id) => id !== currentUser._id)
        : [...likes, currentUser._id]

      setLikes(updatedLikes)
      onUpdatePost(post._id, { likes: updatedLikes })
    } catch (err) {
      console.error("Like toggle failed", err)
    } finally {
      setLikeLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setCommentLoading(true)
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + `/comment/create-comment`,
        { text: commentText, postId: post._id  },
        { withCredentials: true }
      )

      const newComment = res.data.data
      const updatedComments = [...comments, newComment]

      setComments(updatedComments)
      onUpdatePost(post._id, { comments: updatedComments })
      setCommentText("")
    } catch (err) {
      console.error("Add comment failed", err)
    } finally {
      setCommentLoading(false)
    }
  }

  const handleLikeComment = async (commentId) => {
  try {
    await axios.patch(
      import.meta.env.VITE_BACKEND_URL + `/comment/like/${commentId}`,
      {},
      { withCredentials: true }
    )

    setComments((prev) =>
      prev.map((c) => {
        if (c._id !== commentId) return c

        const alreadyLiked = c.likes?.includes(currentUser._id)
        const updatedLikes = alreadyLiked
          ? c.likes.filter((id) => id !== currentUser._id)
          : [...(c.likes || []), currentUser._id]

        return { ...c, likes: updatedLikes }
      })
    )
  } catch (err) {
    console.error("Comment like failed", err)
  }
}

const handleDeleteComment = async (commentId) => {
  try {
    await axios.delete(
      import.meta.env.VITE_BACKEND_URL + `/comment/${commentId}`,
      { withCredentials: true }
    )

    const updatedComments = comments.filter((c) => c._id !== commentId)
    setComments(updatedComments)
    onUpdatePost(post._id, { comments: updatedComments })
  } catch (err) {
    console.error("Comment delete failed", err)
    alert(err.response?.data?.err || "Failed to delete comment")
  }
}

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="md:w-1/2 bg-black flex items-center justify-center">
          <img
            src={post.imageUrl}
            alt="post"
            className="w-full h-full object-contain max-h-[50vh] md:max-h-[90vh]"
          />
        </div>

        {/* Right side */}
        <div className="md:w-1/2 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <p className="text-white font-medium">{post.caption || "No caption"}</p>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl px-2"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Comments list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {comments.length === 0 ? (
  <p className="text-gray-500 text-sm">No comments yet.</p>
) : (
  comments.map((c) => {
    const isCommentOwner = c.authorId?._id === currentUser?._id
    const isPostOwner = post.authorId === currentUser?._id || post.authorId?._id === currentUser?._id
    const canDelete = isCommentOwner || isPostOwner
    const isCommentLiked = c.likes?.includes(currentUser?._id)

    return (
      <div key={c._id} className="text-sm group">
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-indigo-400 font-semibold mr-2">
              @{c.authorId?.username || "user"}
            </span>
            <span className="text-gray-300">{c.text}</span>
          </div>

          {canDelete && (
            <button
              onClick={() => handleDeleteComment(c._id)}
              className="text-gray-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition"
            >
              <i className="fa-solid fa-trash text-xs"></i>
            </button>
          )}
        </div>

        <button
          onClick={() => handleLikeComment(c._id)}
          className="flex items-center gap-1 mt-1 text-xs text-gray-500 hover:text-rose-400"
        >
          <i
            className={`fa-solid fa-heart ${
              isCommentLiked ? "text-rose-500" : "text-gray-500"
            }`}
          ></i>
          {c.likes?.length || 0}
        </button>
      </div>
    )
  })
)}
          </div>

          {/* Like + comment count */}
          <div className="flex items-center gap-6 px-4 py-3 border-t border-white/10">
            <button
              onClick={handleLikeToggle}
              disabled={likeLoading}
              className="flex items-center gap-2 text-white disabled:opacity-50"
            >
              <i
                className={`fa-solid fa-heart ${
                  isLiked ? "text-rose-500" : "text-gray-400"
                }`}
              ></i>
              {likes.length}
            </button>

            <span className="flex items-center gap-2 text-gray-400">
              <i className="fa-solid fa-comment text-indigo-400"></i>
              {comments.length}
            </span>
          </div>

          {/* Add comment form */}
          <form
            onSubmit={handleAddComment}
            className="flex items-center gap-2 p-4 border-t border-white/10"
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={commentLoading || !commentText.trim()}
              className="text-indigo-400 font-semibold text-sm disabled:opacity-40"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostModal