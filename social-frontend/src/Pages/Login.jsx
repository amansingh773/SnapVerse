import axios from "axios"
import { useState } from "react"
import validator from "validator"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addUserData } from "../Utils/UserSlice"

const Login = () => {

    const dispatch = useDispatch()
    const[val, setVal] = useState({
        id : "",
        password : ""
    })
    const navigate = useNavigate()
    // console.log(val)
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
        
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Welcome Back
        </h1>

        <div className="space-y-6">
          
          <div>
            <label className="block text-gray-300 mb-2">
              Username or Email
            </label>

            <input
              onChange={(e) => {
                setVal({
                    ...val,
                    id : e.target.value
                })
              }}
              type="text"
              className="
                w-full px-4 py-3 rounded-xl
                bg-white/10 border border-white/10
                text-white placeholder-gray-400
                outline-none
                focus:border-indigo-500
                transition
              "
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Password
            </label>

            <input
              onChange={(e) => {
                setVal({
                    ...val,
                    password : e.target.value
                })
              }}
              type="password"
              className="
                w-full px-4 py-3 rounded-xl
                bg-white/10 border border-white/10
                text-white placeholder-gray-400
                outline-none
                focus:border-indigo-500
                transition
              "
            />
          </div>

          <button
            onClick={async() => {
                if(!val.id || !val.password)
                {
                    toast.error("Please enter all the fields")
                    return
                }
                try {
                    
                    const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/auth/login", {
                        password : val.password, 
                        [validator.isEmail(val.id) ? "email" : "username"] : val.id
                    },
                    {withCredentials : true}
                    )
                    
                    dispatch(addUserData(res.data.data))
                    navigate("/home")

                } catch (error) {
                    toast.error("Invalid Credentials")
                }


               

            }}
            className="
              w-full py-3
              bg-indigo-600 hover:bg-indigo-500
              text-white font-semibold
              rounded-xl
              transition-all duration-300
              hover:shadow-lg
              hover:scale-[1.02]
              active:scale-[0.98]
            "
          >
            Log In
          </button>

          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")} className="text-indigo-400 hover:text-indigo-300 cursor-pointer">
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login