import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#f97316",
  "#3b82f6",
  "#ec4899",
  "#a855f7",
  "#06b6d4",
  "#ef4444",
  "#eab308",
];

const Stats = () => {
  const [dailyData, setDailyData] = useState([]);
  const [appData, setAppData] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) ?? true
  );

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    loadRealData();

    const handleFocus = () => {
      loadRealData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadRealData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadRealData = () => {
    axios
      .get("http://localhost:5000/api/history")
      .then((res) => {
        const allSessions = res.data;

        const getToday = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

        const usageHistory = allSessions.filter(
          (session) => session.date === getToday()
        );

        // DAILY DATA
        const dailyUsage = {};

        usageHistory.forEach((session) => {
          if (!dailyUsage[session.date]) {
            dailyUsage[session.date] = 0;
          }

          dailyUsage[session.date] += session.duration;
        });

        const dailyArray = Object.keys(dailyUsage)
          .sort()
          .map((date) => ({
            date,
            minutes: dailyUsage[date],
          }));

        setDailyData(dailyArray);

        // APP DATA
        const appTotals = {};

        usageHistory.forEach((session) => {
          if (!appTotals[session.app]) {
            appTotals[session.app] = 0;
          }

          appTotals[session.app] += session.duration;
        });

        const appArray = Object.keys(appTotals).map((app) => ({
          name: app,
          value: appTotals[app],
        }));

        setAppData(appArray);

        // TOTALS
        const totalMin = usageHistory.reduce(
          (acc, session) => acc + session.duration,
          0
        );

        setTotalMinutes(totalMin);
        setTotalSessions(usageHistory.length);
      })
      .catch((error) => {
        console.log("Stats Load Error:", error);
      });
  };

  return (
    <div
      className={`min-h-screen p-8 transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#111827] to-black text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
            ScreenSense Analytics
          </h1>

          <div className="flex gap-4 flex-wrap">

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-7 py-3 rounded-full font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            >
              {darkMode ? " Light Mode" : " Dark Mode"}
            </button>

            <Link
              to="/home"
              className="px-7 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            >
              Home
            </Link>

            <Link
              to="/timer"
              className="px-7 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
            >
              Timer
            </Link>

            <Link
              to="/history"
              className="px-7 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
            >
              History
            </Link>

          </div>
        </header>

        {/* SUMMARY */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">

          <div className="bg-white/10 p-8 rounded-3xl">
            <p>Total Sessions</p>
            <h2 className="text-5xl font-bold">{totalSessions}</h2>
          </div>

          <div className="bg-white/10 p-8 rounded-3xl">
            <p>Total Usage</p>
            <h2 className="text-5xl font-bold">
              {(totalMinutes * 60).toFixed(0)} sec
            </h2>
          </div>

          <div className="bg-white/10 p-8 rounded-3xl">
            <p>Avg per Session</p>
            <h2 className="text-5xl font-bold">
              {totalSessions
                ? Math.round((totalMinutes * 60) / totalSessions)
                : 0} sec
            </h2>
          </div>

        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-12">

          {/* BAR */}
          <div className="bg-white/10 p-8 rounded-3xl">
            <h3 className="text-2xl font-semibold mb-6">
              📅 Daily Usage
            </h3>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dailyData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes">
                  {dailyData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE */}
          <div className="bg-white/10 p-8 rounded-3xl">
            <h3 className="text-2xl font-semibold mb-6">
              🥧 Usage by App
            </h3>

            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={appData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={140}
                  label
                >
                  {appData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Stats;