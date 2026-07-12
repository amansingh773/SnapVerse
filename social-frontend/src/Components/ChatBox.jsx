import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const ChatBox = ({ selectedUser }) => {
  const [msgs, setMsgs] = useState([]);
  const socketRef = useRef(null);
  const textRef = useRef(null);

  const data = useSelector((store) => store.user);
//   console.log(selectedUser)


  useEffect(() => {
    if(selectedUser)
    {

        async function getChats()
        {
            const res = await axios.get(import.meta.env.VITE_BACKEND_URL + `/chats/get-msgs/${selectedUser._id}`, {withCredentials : true})
            // console.log(res.data)


            let existingMsgs = res.data.map((item) => {
                return {
                    text : item.text,
                    sender : item.senderId
                }
            })

            setMsgs(existingMsgs)
        }   
        
        getChats()
    }
  }, [selectedUser])

  useEffect(() => {
    if (!selectedUser) return;

    setMsgs([]);

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL);

    socketRef.current.emit("join-room", {
      sender: data._id,
      receiver: selectedUser._id,
    });

    socketRef.current.on("receive-msg", (obj) => {
      console.log("Received:", obj);
      setMsgs((prev) => [...prev, obj]);
    });

    return () => {
      socketRef.current.off("receive-msg");
      socketRef.current.disconnect();
    };
  }, [selectedUser, data._id]);

  useEffect(() => {
    if (selectedUser && textRef.current) {
      textRef.current.focus();
    }
  }, [selectedUser]);

  const sendMessage = () => {
    const text = textRef.current.value.trim();

    if (!text) return;

    const message = {
      text,
      sender: data._id,
      receiver: selectedUser._id,
    };

    socketRef.current.emit("send-msg", message);

    // Show instantly
    setMsgs((prev) => [...prev, message]);

    textRef.current.value = "";
    textRef.current.focus();
  };

  if (!selectedUser) {
    return (
      <div className="hidden sm:flex flex-1 items-center justify-center bg-[#0f172a]">
        <div className="text-center">
          <i className="fa-regular fa-comment-dots text-6xl text-gray-600 mb-5 block"></i>

          <h2 className="text-xl font-semibold text-white mb-2">
            No Chat Selected
          </h2>

          <p className="text-gray-400">
            Select someone from the sidebar to start chatting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden sm:flex flex-1 flex-col bg-[#0f172a]">
      {/* Header */}
      <div className="h-20 px-6 border-b border-gray-800 flex items-center gap-4 bg-[#111827] shadow">
        <img
          src={
            selectedUser.displayPicture ||
            "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
          }
          alt={selectedUser.username}
          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
        />

        <div>
          <h2 className="text-white font-semibold text-lg">
            {selectedUser.firstName} {selectedUser.lastName}
          </h2>

          <p className="text-gray-400 text-sm">
            @{selectedUser.username}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3 bg-[#0b1120] scrollbar-none">
        {msgs.length > 0 ? (
          msgs.map((item, idx) => (
            <div
              key={idx}
              className={
                "max-w-[70%] px-4 py-2 rounded-2xl text-sm break-words shadow " +
                (item.sender === data._id
                  ? "bg-indigo-600 text-white self-end rounded-br-md"
                  : "bg-gray-200 text-gray-900 self-start rounded-bl-md")
              }
            >
              {item.text}
            </div>
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-gray-500 text-lg">
              No messages yet 👋
            </p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 bg-[#111827] p-4">
        <div className="flex gap-3">
          <input
            ref={textRef}
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-[#1f2937] text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-indigo-500 placeholder:text-gray-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            className="bg-indigo-600 hover:bg-indigo-700 transition px-7 rounded-xl text-white font-semibold"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;