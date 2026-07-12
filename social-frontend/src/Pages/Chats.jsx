import { useState } from "react"
import Navbar from "../Components/Navbar"
import Sidebar from "../Components/Sidebar"
import ChatSidebar from "../Components/ChatSidebar"
import ChatBox from "../Components/ChatBox"

const Chats = () => {
  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex bg-gradient-to-br from-indigo-950 via-slate-900 to-black overflow-hidden">
          <ChatSidebar
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />

          <ChatBox selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  )
}

export default Chats