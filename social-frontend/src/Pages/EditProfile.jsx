import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"
import { addUserData } from "../Utils/UserSlice"
import { useNavigate } from "react-router-dom"
import Navbar from "../Components/Navbar"
import Sidebar from "../Components/Sidebar"

const EditProfile = () => {
  const { firstName, lastName, bio } = useSelector(
    (store) => store.user
  );

  const dispatch = useDispatch()
  const nav = useNavigate()
  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    bio: bio || "",
  });

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
              <h1 className="text-3xl font-bold text-white text-center mb-8">
                Edit Profile
              </h1>

              <div className="space-y-6">
                {/* Profile Picture */}
                {/* <div className="flex flex-col items-center">
                  <p className="text-gray-300 font-medium mb-4">
                    Profile Picture
                  </p>

                  <div className="relative group">
                    <input
                      id="displayPicture"
                      type="file"
                      className="hidden"
                    />

                    <img
                      src={
                        displayPicture ||
                        "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                      }
                      alt="Profile"
                      className="
                        w-36 h-36
                        rounded-full
                        object-cover
                        border-4 border-indigo-500
                        shadow-2xl
                      "
                    />

                    <div
                      onClick={() => {
                        document
                          .getElementById("displayPicture")
                          .click();
                      }}
                      className="
                        absolute inset-0
                        rounded-full
                        bg-black/50
                        opacity-0
                        group-hover:opacity-100
                        transition-all duration-300
                        flex items-center justify-center
                        cursor-pointer
                      "
                    >
                      <div className="flex flex-col items-center text-white">
                        <i className="fa-solid fa-camera text-2xl mb-1"></i>
                        <span className="text-xs font-medium">
                          Change
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    Click the image to upload a new profile picture
                  </p>
                </div> */}

                {/* First Name */}
                <div>
                  <label className="block text-gray-300 mb-2">
                    First Name
                  </label>

                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        firstName: e.target.value,
                      })
                    }
                    className="
                      w-full px-4 py-3 rounded-xl
                      bg-white/10 border border-white/10
                      text-white placeholder-gray-400
                      outline-none
                      focus:border-indigo-500
                    "
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-gray-300 mb-2">
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastName: e.target.value,
                      })
                    }
                    className="
                      w-full px-4 py-3 rounded-xl
                      bg-white/10 border border-white/10
                      text-white placeholder-gray-400
                      outline-none
                      focus:border-indigo-500
                    "
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-gray-300 mb-2">
                    Bio
                  </label>

                  <textarea
                    rows={4}
                    maxLength={250}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bio: e.target.value,
                      })
                    }
                    placeholder="Tell people something about yourself..."
                    className="
                      w-full px-4 py-3 rounded-xl
                      bg-white/10 border border-white/10
                      text-white placeholder-gray-400
                      outline-none resize-none
                      focus:border-indigo-500
                    "
                  />

                  <p className="text-right text-sm text-gray-400 mt-1">
                    {formData.bio.length}/250
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      nav("/profile")
                    }}
                    className="
                      flex-1 py-3
                      bg-white/10 hover:bg-white/20
                      border border-white/10
                      text-white font-semibold
                      rounded-xl
                      transition duration-300
                    "
                  >
                    Cancel
                  </button>

                  <button
                    onClick={async() => {
                      const res = await axios.patch(import.meta.env.VITE_BACKEND_URL + "/profile/edit", formData, {withCredentials : true})
                      dispatch(addUserData(res.data.data))
                      nav("/profile")
                    }}
                    className="
                      flex-1 py-3
                      bg-indigo-600 hover:bg-indigo-500
                      text-white font-semibold
                      rounded-xl
                      transition duration-300
                      hover:shadow-lg
                    "
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;