import { useSelector } from "react-redux"

const ChatSidebar = ({ selectedUser, setSelectedUser }) => {
  const currentUser = useSelector((store) => store.user)
  const following = currentUser?.following || []

  return (
    <div className="w-full sm:w-80 border-r border-white/10 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-white text-lg font-semibold">Chats</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {following.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <i className="fa-solid fa-comments text-3xl text-gray-600 mb-3"></i>

            <p className="text-gray-400 text-sm">
              You're not following anyone yet.
            </p>
          </div>
        ) : (
          following.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 transition
                hover:bg-white/5 text-left
                ${
                  selectedUser?._id === user._id
                    ? "bg-white/10"
                    : ""
                }
              `}
            >
              <img
                src={
                  user.displayPicture ||
                  "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                }
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover border border-white/10"
              />

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>

                <p className="text-gray-400 text-sm truncate">
                  @{user.username}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export default ChatSidebar