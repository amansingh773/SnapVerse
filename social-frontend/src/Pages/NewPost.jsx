import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { addUserData } from "../Utils/UserSlice";

const NewPost = () => {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      return toast.error("Please select an image");
    }

    try {
      setLoading(true);

      
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "Socially");

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/derddgaed/image/upload",
        formData
      );

      const uploadedImageUrl = cloudRes.data.url

     
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/create`,
        {
          caption,
          imageUrl: uploadedImageUrl,
        },
        {
          withCredentials: true,
        }
      );

      
      const userRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/get-user-data`,
        {
          withCredentials: true,
        }
      );

      dispatch(addUserData(userRes.data.data));

      toast.success("Post created successfully");

      setCaption("");
      setImageFile(null);
      setPreviewUrl("");

      navigate("/profile");

    } catch (error) {
      toast.error(
        error?.response?.data?.err ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
              <h1 className="text-3xl font-bold mb-2 text-white">
                Create New Post
              </h1>

              <p className="text-gray-400 mb-8">
                Share something with your followers.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-300">
                    Caption
                  </label>

                  <textarea
                    rows="5"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="What's on your mind?"
                    className="
                      w-full px-4 py-3 rounded-xl
                      bg-white/10 border border-white/10
                      text-white placeholder-gray-400
                      outline-none resize-none
                      focus:border-indigo-500
                    "
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-300">
                    Image
                  </label>

                  <input
                    id="postImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (!file) return
                      setImageFile(file)
                      setPreviewUrl(URL.createObjectURL(file))
                    }}
                    className="hidden"
                  />

                  <label
                    htmlFor="postImage"
                    className="
                      flex flex-col items-center justify-center
                      w-full h-48
                      border-2 border-dashed border-white/20
                      rounded-xl
                      cursor-pointer
                      hover:border-indigo-500
                      transition
                      text-gray-400
                    "
                  >
                    <i className="fa-solid fa-cloud-arrow-up text-3xl mb-2"></i>
                    <span className="text-sm">
                      {imageFile ? imageFile.name : "Click to select an image"}
                    </span>
                  </label>
                </div>

                {previewUrl && (
                  <div>
                    <p className="mb-2 font-medium text-gray-300">
                      Preview
                    </p>

                    <img
                      src={previewUrl}
                      alt="preview"
                      className="w-full h-80 object-cover rounded-xl border border-white/10"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full py-3
                    bg-indigo-600 hover:bg-indigo-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                    text-white font-semibold
                    rounded-xl
                    transition duration-300
                  "
                >
                  {loading ? "Uploading..." : "Create Post"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default NewPost