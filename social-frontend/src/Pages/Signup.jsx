import { useState } from "react";
import axios from "axios";
import validator from "validator";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const inputStyles = `
  px-4 py-3 rounded-xl
  bg-white/10 border border-white/10
  text-white placeholder-gray-400
  outline-none focus:border-indigo-500
  disabled:bg-white/5
  disabled:text-gray-500
  disabled:placeholder-gray-600
  disabled:border-white/5
  disabled:cursor-not-allowed
  disabled:opacity-60
`;

const Signup = () => {
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [isEmailLocked, setIsEmailLocked] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const nav = useNavigate();

  const sendOtp = async () => {
    try {
      if (!validator.isEmail(email)) {
        toast.error("Please enter a valid email");
        return;
      }

      const res = await axios.post(`${backendUrl}/auth/send-otp`, {
        email,
      });

      if (res.status === 201) {
        setIsOtpVisible(true);
        setIsEmailLocked(true);
        toast.success(`OTP sent to ${email}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      if (!validator.isNumeric(otp) ) {
        toast.error("Please enter a valid 6-digit OTP");
        return;
      }

      const res = await axios.post(`${backendUrl}/auth/verify-otp`, {
        email,
        otp,
      });

      if (res.status === 201) {
        setIsFormDisabled(false);
        setIsOtpVisible(false);
        toast.success("Email verified");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Incorrect OTP");
    }
  };

  const signup = async () => {
    try {
      if (!email) {
        toast.error("Please enter a valid email");
        return;
      }

      if (username.length < 2 || username.length > 12) {
        toast.error("Username must be between 2 and 12 characters");
        return;
      }

      if (!validator.isStrongPassword(password)) {
        toast.error("Please enter a strong password");
        return;
      }

      const res = await axios.post(`${backendUrl}/auth/signup`, {
        email,
        username,
        password,
      });

      if (res.status === 201) {
        toast.success("Account created successfully");
        nav("/login");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Create Account
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>

            <div className="flex gap-2">
              <input
                disabled={isEmailLocked}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className={`flex-1 ${inputStyles}`}
              />

              <button
                disabled={isEmailLocked}
                onClick={sendOtp}
                className="
                  px-4 py-3
                  bg-indigo-600
                  hover:bg-indigo-500
                  text-white
                  rounded-xl
                  font-medium
                  transition
                  disabled:bg-slate-700
                  disabled:text-slate-400
                  disabled:cursor-not-allowed
                  disabled:hover:bg-slate-700
                "
              >
                {isEmailLocked ? "OTP Sent" : "Send OTP"}
              </button>
            </div>

            {isOtpVisible && (
              <div className="mt-3 flex gap-2">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  type="number"
                  placeholder="Enter OTP"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 outline-none focus:border-indigo-500"
                />

                <button
                  onClick={verifyOtp}
                  className="
                    px-5 py-3
                    bg-emerald-600
                    hover:bg-emerald-500
                    text-white
                    font-medium
                    rounded-xl
                    transition-all
                    duration-300
                    hover:scale-105
                    active:scale-95
                    shadow-lg
                  "
                >
                  Verify
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Username</label>

            <input
              disabled={isFormDisabled}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className={`w-full ${inputStyles}`}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>

            <input
              disabled={isFormDisabled}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className={`w-full ${inputStyles}`}
            />
          </div>

          <button
            disabled={isFormDisabled}
            onClick={signup}
            className="
              w-full py-3
              bg-indigo-600 hover:bg-indigo-500
              text-white font-semibold
              rounded-xl
              transition duration-300
              disabled:bg-slate-700
              disabled:text-slate-400
              disabled:cursor-not-allowed
              disabled:hover:bg-slate-700
            "
          >
            Sign Up
          </button>


          <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => nav("/login")}
            className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
          >
            Log In
          </span>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;