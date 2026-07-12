import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios"

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const nav = useNavigate()

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside
      onMouseEnter={() => setShowSidebar(true)}
      onMouseLeave={() => setShowSidebar(false)}
      className={`
        h-full
        bg-slate-950/90
        backdrop-blur-md
        border-r border-white/10
        flex flex-col
        justify-between
        transition-all duration-300
        overflow-hidden
        ${showSidebar ? "w-60" : "w-20"}
      `}
    >
      <div className="py-6">
        <div className="space-y-2 px-3">
          <NavLink to="/home" className={navItemClass}>
            <i className="fa-regular fa-house text-lg min-w-[20px]"></i>
            {showSidebar && <span>Home</span>}
          </NavLink>

          <NavLink to="/profile" className={navItemClass}>
            <i className="fa-regular fa-user text-lg min-w-[20px]"></i>
            {showSidebar && <span>Profile</span>}
          </NavLink>

          <NavLink to="/chats" className={navItemClass}>
            <i className="fa-regular fa-comment text-lg min-w-[20px]"></i>
            {showSidebar && <span>Chats</span>}
          </NavLink>

          <NavLink to="/post/new" className={navItemClass}>
            <i className="fa-solid fa-plus text-lg min-w-[20px]"></i>
            {showSidebar && <span>New Post</span>}
          </NavLink>
        </div>
      </div>

      <div className="p-3" 
         onClick={() => {
            axios.post(import.meta.env.VITE_BACKEND_URL + "/auth/logout", {}, {withCredentials : true})
            .then(() => {
               nav("/")
            })
         }}
      >
        <button
          className="
            w-full
            flex items-center
            gap-4
            px-4 py-3
            rounded-xl
            bg-red-500/20
            text-red-400
            hover:bg-red-500/30
            transition
          "
        >
          <i className="fa-solid fa-right-from-bracket min-w-[20px]"></i>
          {showSidebar && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;