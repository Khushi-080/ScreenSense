import { Link } from "react-router-dom";

const Navbar = ({ darkMode, toggleDark }) => {
  return (
    <div className="flex justify-between items-center px-10 py-6 bg-white/5 backdrop-blur-xl rounded-2xl mb-10">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">ScreenSense</h1>

      <div className="flex gap-4">
        <button
          onClick={toggleDark}
          className="px-7 py-3 rounded-full font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] text-white"
        >
          {darkMode ? " Light" : " Dark"}
        </button>

        <Link
          to="/"
          className="px-7 py-3 rounded-full font-bold bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.5)] text-white"
        >
           Home
        </Link>

        <Link
          to="/pomodoro"
          className="px-7 py-3 rounded-full font-bold bg-gradient-to-r from-yellow-400 to-orange-400 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] text-white flex items-center gap-2"
        >
           <span className="text-xl">🍅</span>
           Pomodoro
        </Link>

        {/* <Link
          to="/index"
          className="px-7 py-3 rounded-full font-bold bg-gradient-to-r from-gray-500 to-purple-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(107,114,128,0.5)] text-white"
        >
           Index
        </Link> */}

        <Link
          to="/stats"
          className="px-7 py-3 rounded-full font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.5)] text-white"
        >
           Stats
        </Link>

        <Link
          to="/streaks"
          className="px-7 py-3 rounded-full font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)] text-white"
        >
           Streaks
        </Link>

        <Link
          to="/history"
          className="px-7 py-3 rounded-full font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] text-white"
        >
           History
        </Link>
{/* 
        <Link
          to="/timer"
          className="px-4 py-2 rounded-full font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] text-white"
        >
           Timer
        </Link> */}
      </div>
    </div>
  );
};

export default Navbar;