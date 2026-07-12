import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import Navbar from "../Components/Navbar"
import Sidebar from "../Components/Sidebar"
import PostModal from "./PostModal"
import { updateFollowing } from "../Utils/UserSlice"

const UserProfile = () => {
  const { id } = useParams()
  const currentUser = useSelector((store) => store.user)

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    

    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      try {
            const res = await axios.get(
            import.meta.env.VITE_BACKEND_URL + `/profile/${id}`,{ withCredentials: true,})

            setUser(res.data.data)
            setIsFollowing(res.data.data.isFollowing)
            
        } catch  {
         alert("Failed to fetch profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
    
  }, [id])

 const handleFollowToggle = async () => {
    setFollowLoading(true)
    try {
        await axios.patch(import.meta.env.VITE_BACKEND_URL + `/profile/follow/${id}`,{},{ withCredentials: true })
        
        setIsFollowing((prev) => !prev)
        setUser((prev) => ({
            ...prev,
            followers: isFollowing
            ? prev.followers.filter((f) => f !== currentUser._id)
            : [...prev.followers, currentUser._id],
        }))

        dispatch(updateFollowing({ 
          targetUser: { 
            _id: user._id, 
            username: user.username, 
            displayPicture: user.displayPicture,
            firstName: user.firstName,
            lastName: user.lastName
          }, 
          isFollowing 
        }))

    } catch (err) {
      console.error("Follow toggle failed", err)
    } finally {
      setFollowLoading(false)
    }
}

  const handleUpdatePost = (postId, updatedFields) => {
  setUser((prev) => ({
    ...prev,
    posts: prev.posts.map((p) =>
      p._id === postId ? { ...p, ...updatedFields } : p
    ),
  }))
}

  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 bg-gradient-to-br from-indigo-950 via-slate-900 to-black flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 bg-gradient-to-br from-indigo-950 via-slate-900 to-black flex items-center justify-center">
            <p className="text-rose-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">

              {/* Profile Header */}
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <img
                  src={
                    user.displayPicture ||
                    "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                  }
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-indigo-500 shadow-xl"
                />

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white">
                    {user.firstName} {user.lastName}
                  </h2>

                  <span className="text-indigo-400 text-lg">
                    @{user.username}
                  </span>

                  <p className="text-gray-300 mt-4">
                    {user.bio || "No bio added yet."}
                  </p>
                </div>

                <div className="flex flex-col gap-3 self-start md:self-center w-full md:w-auto">
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`
                      px-5 py-2.5 rounded-xl transition font-medium
                      disabled:opacity-50
                      ${
                        isFollowing
                          ? "bg-white/10 border border-white/10 hover:bg-white/20 text-white backdrop-blur-md"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }
                    `}
                  >
                    <i
                      className={`fa-solid ${
                        isFollowing ? "fa-user-minus" : "fa-user-plus"
                      } mr-2`}
                    ></i>
                    {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-10">
                <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
                  <h2 className="text-2xl font-bold text-white">
                    {user.followers?.length || 0}
                  </h2>
                  <p className="text-gray-400">Followers</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
                  <h2 className="text-2xl font-bold text-white">
                    {user.following?.length || 0}
                  </h2>
                  <p className="text-gray-400">Following</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
                  <h2 className="text-2xl font-bold text-white">
                    {user.posts?.length || 0}
                  </h2>
                  <p className="text-gray-400">Posts</p>
                </div>
              </div>

              {/* Posts */}
              <div className="mt-10">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                  <i className="fa-regular fa-images text-indigo-400"></i>
                  Posts
                </h2>

                {!user.posts || user.posts.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <i className="fa-regular fa-image text-gray-500 text-4xl mb-3 block"></i>
                    <h1 className="text-gray-400 text-xl">No posts yet...</h1>
                    <p className="text-gray-500 text-sm mt-2">
                      This user hasn't posted anything yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {user.posts.map((post) => (
                      <div
                        key={post._id}
                        onClick={() => setSelectedPost(post)}
                        className="
                          group relative
                          bg-white/5 border border-white/10
                          rounded-2xl overflow-hidden
                          hover:border-indigo-500/50
                          hover:-translate-y-1
                          transition-all duration-300
                          shadow-lg hover:shadow-indigo-500/20
                        "
                      >
                        <div className="relative overflow-hidden h-60">
                          <img
                            src={post.imageUrl}
                            alt="post"
                            className="
                              w-full h-full object-cover
                              group-hover:scale-110
                              transition-transform duration-500
                            "
                          />

                          <div
                            className="
                              absolute inset-0
                              bg-black/0 group-hover:bg-black/40
                              flex items-center justify-center gap-6
                              opacity-0 group-hover:opacity-100
                              transition-all duration-300
                            "
                          >
                            <span className="flex items-center gap-2 text-white font-semibold">
                              <i className="fa-solid fa-heart text-rose-500"></i>
                              {post.likes?.length || 0}
                            </span>

                            <span className="flex items-center gap-2 text-white font-semibold">
                              <i className="fa-solid fa-comment text-indigo-400"></i>
                              {post.comments?.length || 0}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <p className="text-gray-200 text-sm break-words line-clamp-2">
                            {post.caption || "No caption"}
                          </p>

                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10 text-gray-400 text-xs">
                            <span className="flex items-center gap-1.5">
                              <i className="fa-solid fa-heart text-rose-500/80"></i>
                              {post.likes?.length || 0} likes
                            </span>

                            <span className="flex items-center gap-1.5">
                              <i className="fa-solid fa-comment text-indigo-400/80"></i>
                              {post.comments?.length || 0} comments
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
      {selectedPost && (
      <PostModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onUpdatePost={handleUpdatePost}
      />
)}
    </div>
  )
}

export default UserProfile