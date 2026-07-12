import { useEffect, useRef, useState, useCallback } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import Navbar from "../Components/Navbar"
import Sidebar from "../Components/Sidebar"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)
  const [openComments, setOpenComments] = useState({}) // { [postId]: true/false }
  const [commentText, setCommentText] = useState({}) // { [postId]: "text" }

  const currentUser = useSelector((state) => state.user)

  const skipRef = useRef(0)
  const observerRef = useRef(null)

  const fetchPosts = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setLoading(true)
      skipRef.current = 0
    } else {
      setLoadingMore(true)
    }

    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + `/post/getpost`,
        {
          params: { skip: skipRef.current },
          withCredentials: true,
        }
      )

      const newPosts = res.data.posts || []

      setPosts((prev) => (isInitial ? newPosts : [...prev, ...newPosts]))
      skipRef.current += newPosts.length
      setHasMore(newPosts.length === 10)
    } catch (err) {
      setError("Failed to load posts")
      console.error(err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(true)
  }, [fetchPosts])

  const lastPostRef = useCallback(
    (node) => {
      if (loading || loadingMore) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts(false)
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [loading, loadingMore, hasMore, fetchPosts]
  )

// ---- LIKE / UNLIKE ----
const handleLike = async (postId) => {
  // optimistic update
  setPosts((prev) =>
    prev.map((p) => {
      if (p._id !== postId) return p
      const alreadyLiked = p.likes?.includes(currentUser.id)
      return {
        ...p,
        likes: alreadyLiked
          ? p.likes.filter((id) => id !== currentUser.id)
          : [...(p.likes || []), currentUser.id],
      }
    })
  )

  try {
    await axios.patch(
      import.meta.env.VITE_BACKEND_URL + `/post/like/${postId}`,
      {},
      { withCredentials: true }
    )
  } catch (err) {
    console.error("Like failed", err)
    
    fetchPosts(true)
  }
}
// ---- COMMENT ----
const toggleComments = (postId) => {
  setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }))
}

const handleCommentChange = (postId, value) => {
  setCommentText((prev) => ({ ...prev, [postId]: value }))
}

const handleAddComment = async (postId) => {
  const text = commentText[postId]?.trim()
  if (!text) return

  try {
    const res = await axios.post(
      import.meta.env.VITE_BACKEND_URL + `/comment/create-comment`,
      { text, postId },
      { withCredentials: true }
    )

    const newComment = res.data.data

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, comments: [...(p.comments || []), newComment] }
          : p
      )
    )
    setCommentText((prev) => ({ ...prev, [postId]: "" }))
  } catch (err) {
    console.error("Comment failed", err)
  }
}

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 bg-gradient-to-br from-indigo-950 via-slate-900 to-black overflow-y-auto">
          <div className="max-w-xl mx-auto py-6 px-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400">Loading...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-rose-400">{error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
                <i className="fa-regular fa-image text-5xl text-gray-600 mb-4"></i>
                <p className="text-gray-300 text-lg font-medium">
                  No posts available
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Follow users or post something.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post, index) => {
                  const isLast = index === posts.length - 1
                  const isLiked = post.likes?.includes(currentUser.id)

                  return (
                    <div
                      key={post._id}
                      ref={isLast ? lastPostRef : null}
                      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 p-4">
                        <img
                          src={
                            post.authorId?.displayPicture ||
                            "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                          }
                          alt={post.authorId?.firstName}
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <p className="text-white text-sm font-medium">
                            {post.authorId?.firstName}
                          </p>
                          <p className="text-gray-400 text-xs">
                            @{post.authorId?.firstName}
                          </p>
                        </div>
                      </div>

                      {/* Image - no modal now */}
                      <img
                        src={post.imageUrl}
                        alt="post"
                        className="w-full max-h-[500px] object-cover"
                      />

                      {/* Footer */}
                      <div className="flex items-center gap-6 px-4 py-3 text-gray-300 text-sm">
                        <button
                          onClick={() => handleLike(post._id)}
                          className="flex items-center gap-2"
                        >
                          <i
                            className={`fa-heart ${
                              isLiked ? "fa-solid text-rose-500" : "fa-regular text-gray-300"
                            }`}
                          ></i>
                          {post.likes?.length || 0}
                        </button>
                        <button
                          onClick={() => toggleComments(post._id)}
                          className="flex items-center gap-2"
                        >
                          <i className="fa-solid fa-comment text-indigo-400"></i>
                          {post.comments?.length || 0}
                        </button>
                      </div>

                      {post.caption && (
                        <p className="px-4 pb-2 text-gray-300 text-sm">
                          {post.caption}
                        </p>
                      )}

                      {/* Comments section */}
                      {openComments[post._id] && (
                        <div className="px-4 pb-4 border-t border-white/10 pt-3">
                          <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                            {(post.comments || []).map((c) => (
                              <div key={c._id} className="text-sm text-gray-300">
                                <span className="font-medium text-white mr-2">
                                  {c.authorId?.firstName || "User"}
                                </span>
                                {c.text}
                              </div>
                            ))}
                            {(!post.comments || post.comments.length === 0) && (
                              <p className="text-gray-500 text-xs">
                                No comments yet.
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={commentText[post._id] || ""}
                              onChange={(e) =>
                                handleCommentChange(post._id, e.target.value)
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleAddComment(post._id)
                              }
                              placeholder="Add a comment..."
                              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white outline-none"
                            />
                            <button
                              onClick={() => handleAddComment(post._id)}
                              className="text-indigo-400 text-sm font-medium"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                {loadingMore && (
                  <div className="flex justify-center py-4">
                    <p className="text-gray-400 text-sm">Loading more...</p>
                  </div>
                )}

                {!hasMore && posts.length > 0 && (
                  <p className="text-center text-gray-600 text-xs py-4">
                    You're all caught up.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home