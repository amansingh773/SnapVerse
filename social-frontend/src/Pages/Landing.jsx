import { useNavigate } from "react-router-dom"

const Landing = () => {

    const nav = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white flex items-center justify-center px-6">
      <main className="max-w-3xl text-center">
        <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-3xl p-10 md:p-14 shadow-2xl">
          <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
            🌎 Connect With Everyone
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Socially
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
            Discover new people, share your thoughts, build meaningful
            connections, and stay updated with everything happening around you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => nav("/login")} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:scale-105">
              Login
            </button>

            <button onClick={() => nav("/signup")} className="px-8 py-3 border border-white/20 hover:bg-white/10 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
              Sign Up
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-8 mt-12 text-gray-400 text-sm">
          <div>
            <h3 className="text-2xl font-bold text-white">10K+</h3>
            Users
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white">50K+</h3>
            Posts
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white">100+</h3>
            Communities
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;