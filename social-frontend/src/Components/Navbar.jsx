import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const { username, displayPicture } = useSelector(
    (store) => store.user
  );

  const nav = useNavigate();

  const [query, setQuery] = useState("");
  const [user, setUser] = useState([]);
  const [skip, setSkip] = useState(0);

  const dropRef = useRef(null);
  const invisibleDiv = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropRef.current &&
        !dropRef.current.contains(e.target)
      ) {
        setUser([]);
      }
    };

    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  }, []);

  // Reset pagination when query changes
  useEffect(() => {
    setSkip(0);
  }, [query]);

  // Fetch users
  useEffect(() => {
    if (!query.trim()) {
      setUser([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/profile/search`,
          {
            params: {
              query,
              skip,
            },
            withCredentials: true,
          }
        );

        if (skip === 0) {
          setUser(res.data.data);
        } else {
          setUser((prev) => [...prev, ...res.data.data]);
        }
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, skip]);

  // Infinite scroll
  useEffect(() => {
    if (!dropRef.current || !invisibleDiv.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && user.length > 0) {
          setSkip((prev) => prev + 5);
        }
      },
      {
        root: dropRef.current,
        threshold: 0,
      }
    );

    observer.observe(invisibleDiv.current);

    return () => observer.disconnect();
  }, [user.length]);

  return (
    <nav className="z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        <h3 className="text-2xl font-bold text-white cursor-pointer">
          Socially
        </h3>

        <div className="flex-1 max-w-xl relative">
          <input
            type="text"
            value={query}
            placeholder="Search users..."
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full px-4 py-2.5
              rounded-xl
              bg-white/10
              border border-white/10
              text-white
              placeholder-gray-400
              outline-none
              focus:border-indigo-500
              transition
            "
          />

          {user.length > 0 && (
            <div
              ref={dropRef}
              className="absolute top-14 left-0 w-full bg-slate-900 border border-white/10 rounded-xl shadow-lg overflow-auto max-h-[35vh] hide-scrollbar z-50"
            >
              {user.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    setQuery("");
                    setUser([]);
                    nav(`/profile/${item._id}`)
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer"
                >
                  <img
                    src={
                      item.displayPicture ||
                      "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <span className="text-white">
                    {item.username}
                  </span>
                </div>
              ))}

              {/* Sentinel */}
              <div
                ref={invisibleDiv}
                className="h-3"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-300 font-medium hidden sm:block">
            {username}
          </span>

          <img
            onClick={() => nav("/profile")}
            src={
              displayPicture ||
              "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
            }
            alt="Profile"
            className="
              w-10 h-10
              rounded-full
              object-cover
              border-2 border-indigo-500
              cursor-pointer
              hover:scale-105
              transition
            "
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;