import React, { useEffect, useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addUserData } from "../Utils/UserSlice";

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bio: "",
  });

  const[imgFile, setImgFile] = useState(null)
  const[tempImgUrl, setTempImgUrl] = useState("")
  const[cloudinaryUrl, setCloudinaryUrl] = useState("")
  const nav = useNavigate()
  const dispatch = useDispatch()
//   console.log(cloudinaryUrl)

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    // console.log(tempImgUrl, imgFile)
    if(!tempImgUrl && !imgFile)return

    const formData = new FormData()
    formData.append("file", imgFile)
    formData.append("upload_preset", "Socially")

    async function uploadImg()
    {
        const res = await axios.post("https://api.cloudinary.com/v1_1/derddgaed/image/upload", formData)
        // console.log(res)
        setCloudinaryUrl(res.data.url)
    }

    uploadImg()


  }, [tempImgUrl, imgFile])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Complete Your Profile
        </h1>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">

            <div className="relative group">
              <input
                id="fileIp"
                type="file"
                className="hidden"
                onChange={(e) => {
                    // console.log(e.target.files[0])
                    const tempUrl = URL.createObjectURL(e.target.files[0])
                    setTempImgUrl(tempUrl)
                    setImgFile(e.target.files[0])
                }}
              />

              <img
                src={tempImgUrl || "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"}
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
                  document.getElementById("fileIp").click();
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

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">
                First Name
              </label>

              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                type="text"
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-white/10 border border-white/10
                  text-white placeholder-gray-400
                  outline-none
                  focus:border-indigo-500
                "
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Last Name
              </label>

              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                type="text"
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-white/10 border border-white/10
                  text-white placeholder-gray-400
                  outline-none
                  focus:border-indigo-500
                "
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Date of Birth
            </label>

            <input
              max={new Date().toISOString().split("T")[0]}
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              type="date"
              className="
                w-full px-4 py-3 rounded-xl
                bg-white/10 border border-white/10
                text-white
                outline-none
                focus:border-indigo-500
              "
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Gender
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-xl
                bg-slate-900 border border-white/10
                text-white
                outline-none
                focus:border-indigo-500
              "
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Bio
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              maxLength={250}
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

          <button

            onClick={async() => {
                if(!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.gender)
                {
                    toast.error("Please enter all the required fields..")
                    return
                }


                try {
                    const res = await axios.put(import.meta.env.VITE_BACKEND_URL + "/profile/complete", {
                    ...formData,
                    displayPicture : cloudinaryUrl
                }, {
                    withCredentials : true
                })
                    // console.log(res)
                    dispatch(addUserData(res.data.data))
                    nav("/home")
                } catch (error) {


                }

                


            }}

            className="
              w-full py-3
              bg-indigo-600 hover:bg-indigo-500
              text-white font-semibold
              rounded-xl
              transition duration-300
              hover:shadow-lg
            "
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;