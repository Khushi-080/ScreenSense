// import { Flame, Trophy, Crown, Target, ArrowLeft, Calendar, Zap, Star, Sparkles, Award, Medal, Gem, FireExtinguisher } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { format, parseISO, differenceInDays } from "date-fns";
// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";

// const Streaks = () => {

//   const navigate = useNavigate();
//   const location = useLocation();

//   const [darkMode, setDarkMode] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("darkMode")) ?? true;
//     } catch {
//       return true;
//     }
//   });

//   useEffect(() => {
//     try {
//       localStorage.setItem("darkMode", JSON.stringify(darkMode));
//     } catch {}
//   }, [darkMode]);

//   const [history, setHistory] = useState([]);
//   const [streak, setStreak] = useState(0);
//   const [longestStreak, setLongestStreak] = useState(0);
//   const [totalFocusDays, setTotalFocusDays] = useState(0);
//   const [focusScore, setFocusScore] = useState(0);
//   const [todayUsage, setTodayUsage] = useState(0);
//   const [appLimits, setAppLimits] = useState({});

//   // ---------- LOAD APP LIMITS ----------
//   useEffect(() => {

//     try {

//       const limits = JSON.parse(localStorage.getItem("appLimits")) || {
//         VsCode: 30,
//         Telegram: 20,
//         Instagram: 15,
//         Snapchat: 10,
//         Gmail: 30,
//         YouTube: 30
//       };

//       setAppLimits(limits);

//     } catch {

//       setAppLimits({
//         VsCode: 30,
//         Telegram: 20,
//         Instagram: 15,
//         Snapchat: 10,
//         Gmail: 30,
//         YouTube: 30
//       });

//     }

//   }, []);

//   const dailyLimit = Math.max(
//     Object.values(appLimits).reduce((total, val) => total + (val || 0), 0),
//     1
//   );

//   // ---------- STREAK CALCULATION ----------
//   useEffect(() => {

//     try {

//       const today = new Date().toISOString().split("T")[0];

//       let usageHistory = [];

//       try {

//         const stored = localStorage.getItem("usageHistory");
//         usageHistory = stored ? JSON.parse(stored) : [];

//         if (!Array.isArray(usageHistory)) usageHistory = [];

//       } catch {
//         usageHistory = [];
//       }

//       const todayTotal = usageHistory
//         .filter(s => s?.date === today)
//         .reduce((t, s) => t + (s?.duration || 0), 0);

//       setTodayUsage(todayTotal);

//       const dailyUsage = {};

//       usageHistory.forEach(session => {

//         if (!session?.date) return;

//         if (!dailyUsage[session.date]) {
//           dailyUsage[session.date] = 0;
//         }

//         dailyUsage[session.date] += session.duration || 0;

//       });

//       const dates = Object.keys(dailyUsage).sort().reverse();

//       let maxStreak = 0;
//       let tempStreak = 0;
//       let focusDays = 0;
//       const newHistory = [];

//       for (let i = 0; i < dates.length; i++) {

//         const date = dates[i];
//         const totalMinutes = dailyUsage[date];
//         const underLimit = totalMinutes <= dailyLimit;

//         newHistory.push({
//           date,
//           totalMinutes,
//           underLimit
//         });

//         if (underLimit) {

//           focusDays++;
//           tempStreak++;

//           if (tempStreak > maxStreak) {
//             maxStreak = tempStreak;
//           }

//         } else {

//           tempStreak = 0;

//         }

//       }

//       let currentStreak = 0;

//       for (let date of dates) {

//         if (dailyUsage[date] <= dailyLimit) {
//           currentStreak++;
//         } else {
//           break;
//         }

//       }

//       const totalDays = dates.length || 1;
//       const score = Math.round((focusDays / totalDays) * 100);

//       setFocusScore(score);
//       setTotalFocusDays(focusDays);
//       setLongestStreak(maxStreak);
//       setStreak(currentStreak);
//       setHistory(newHistory);

//     } catch (error) {

//       console.error("Error calculating streaks:", error);

//     }

//   }, [dailyLimit]);

//   const radius = 110;
//   const circumference = 2 * Math.PI * radius;
//   const streakPercent = Math.min((streak / 30) * 100, 100);
//   const strokeOffset = circumference - (streakPercent / 100) * circumference;

//   const getMotivationMessage = () => {

//     if (streak === 0) return "Start your journey today! 🌱";
//     if (streak < 3) return "Great start! Keep the momentum! 🔥";
//     if (streak < 7) return "You're building a habit! 💪";
//     if (streak < 14) return "Impressive consistency! 🌟";
//     if (streak < 21) return "You're on fire! 🔥🔥";
//     if (streak < 30) return "Almost a legend! ⭐";

//     return "You're a focus legend! 👑";

//   };

//   const getStreakLevel = () => {

//     if (streak === 0) return { name: "Beginner", color: "from-gray-400 to-gray-500", icon: "🌱" };
//     if (streak < 7) return { name: "Rookie", color: "from-orange-400 to-red-500", icon: "🔥" };
//     if (streak < 14) return { name: "Warrior", color: "from-yellow-400 to-orange-500", icon: "⚔️" };
//     if (streak < 21) return { name: "Master", color: "from-purple-400 to-pink-500", icon: "🎯" };
//     if (streak < 30) return { name: "Elite", color: "from-blue-400 to-cyan-500", icon: "💎" };

//     return { name: "Legend", color: "from-red-400 to-amber-500", icon: "👑" };

//   };

//   const level = getStreakLevel();

//   if (!appLimits || Object.keys(appLimits).length === 0) {

//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-black text-white">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
//           <p className="text-xl">Loading streaks...</p>
//         </div>
//       </div>
//     );

//   }

//   return (

//     <div className={`min-h-screen transition-all duration-500 ${
//       darkMode
//         ? "bg-gradient-to-br from-[#0f172a] via-[#111827] to-black text-white"
//         : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black"
//     }`}>

//       <div className="max-w-7xl mx-auto px-4 py-8">

//         {/* Header */}

//         <header className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">

//           <div className="flex items-center gap-4">

//             <Flame size={56} className="text-orange-500" />

//             <div>

//               <h1 className="text-5xl font-extrabold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
//                 Streak Arena
//               </h1>

//               <p className="text-sm opacity-60 mt-1">
//                 Track your focus consistency
//               </p>

//             </div>

//           </div>

//           <div className="flex gap-4">

//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className="px-8 py-3 rounded-full font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
//             >
//               {darkMode ? "☀️ Light" : "🌙 Dark"}
//             </button>

//             <button
//               onClick={() => navigate("/")}
//               className="px-8 py-3 rounded-full font-bold bg-gradient-to-r from-gray-500 to-gray-600 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(107,114,128,0.5)] flex items-center gap-2"
//             >
//               <ArrowLeft size={18}/>
//               Dashboard
//             </button>

//           </div>

//         </header>

//         {/* TODAY STATUS */}

//         <div className="mb-8">

//           <div className="relative shine-effect p-8 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 backdrop-blur-xl">

//             <div className="flex items-center justify-between">

//               <div>

//                 <p className="text-lg opacity-70 mb-2">
//                   Today's Usage
//                 </p>

//                 <div className="flex items-baseline gap-4">

//                   <span className="text-6xl font-bold">
//                     {Math.round(todayUsage) || 0}
//                   </span>

//                   <span className="text-2xl opacity-60">
//                     / {dailyLimit} min
//                   </span>

//                 </div>

//               </div>

//               <Zap size={64} className="text-green-400"/>

//             </div>

//           </div>

//         </div>

//         {/* STATS */}

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

//           <div className="bg-white/10 p-8 rounded-3xl border border-orange-400/30">

//             <p className="text-lg opacity-70 mb-2">Current Streak</p>

//             <p className="text-5xl font-bold text-orange-400">
//               {streak}
//             </p>

//           </div>

//           <div className="bg-white/10 p-8 rounded-3xl border border-yellow-400/30">

//             <p className="text-lg opacity-70 mb-2">Longest Streak</p>

//             <p className="text-5xl font-bold text-yellow-400">
//               {longestStreak}
//             </p>

//           </div>

//           <div className="bg-white/10 p-8 rounded-3xl border border-green-400/30">

//             <p className="text-lg opacity-70 mb-2">Focus Days</p>

//             <p className="text-5xl font-bold text-green-400">
//               {totalFocusDays}
//             </p>

//           </div>

//           <div className="bg-white/10 p-8 rounded-3xl border border-purple-400/30">

//             <p className="text-lg opacity-70 mb-2">Focus Score</p>

//             <p className="text-5xl font-bold text-purple-400">
//               {focusScore}%
//             </p>

//           </div>

//         </div>

//         {/* HISTORY */}

//         <div>

//           <h2 className="text-3xl font-semibold flex items-center gap-3 mb-8">

//             <Calendar size={32} className="text-orange-400"/>

//             Focus History

//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

//             {history.slice(0,6).map(({date,totalMinutes,underLimit}) => (

//               <div
//                 key={date}
//                 className={`rounded-2xl p-8 ${
//                   underLimit
//                     ? "bg-green-500/20 border border-green-500/30"
//                     : "bg-red-500/20 border border-red-500/30"
//                 }`}
//               >

//                 <div className="text-sm opacity-60 mb-3">

//                   {(() => {

//                     try {

//                       return format(parseISO(date), "MMM d, yyyy");

//                     } catch {

//                       return date;

//                     }

//                   })()}

//                 </div>

//                 <div className="text-5xl font-bold">

//                   {Math.round(totalMinutes)} min

//                 </div>

//               </div>

//             ))}

//           </div>

//         </div>

//       </div>

//     </div>

//   );

// };

// export default Streaks;





import axios from "axios";
import {
  Flame,
  ArrowLeft,
  Calendar,
  Trophy,
  Medal,
  Crown,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";

const Streaks = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) ?? true
  );
  const getToday = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [focusScore, setFocusScore] = useState(0);
  const [todayUsage, setTodayUsage] = useState(0);

  const [appLimits] = useState(
    JSON.parse(localStorage.getItem("appLimits")) || {
      VsCode: 30,
      Telegram: 20,
      Instagram: 15,
      Snapchat: 10,
      Gmail: 30,
      YouTube: 30,
    }
  );

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const dailyLimit = Object.values(appLimits).reduce(
    (sum, val) => sum + val,
    0
  );

  useEffect(() => {
    loadStreakData();

    const interval = setInterval(() => {
      loadStreakData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadStreakData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/history"
      );

      const sessions = res.data || [];

     const grouped = {};

sessions.forEach((item) => {
  if (!grouped[item.date]) grouped[item.date] = 0;
  grouped[item.date] += item.duration;
});

const dates = Object.keys(grouped).sort(); // oldest to latest

let longest = 0;
let current = 0;
let temp = 0;

for (let i = 0; i < dates.length; i++) {
  const date = dates[i];
  const total = grouped[date];
  const underLimit = total <= dailyLimit;

  if (underLimit) {
    temp++;
    if (temp > longest) longest = temp;
  } else {
    temp = 0;
  }
}

current = 0;

for (let i = dates.length - 1; i >= 0; i--) {
  const date = dates[i];
  const total = grouped[date];

  if (total <= dailyLimit) {
    current++;
  } else {
    break;
  }
}

setStreak(current);
setLongestStreak(longest);

      const score = dates.length
        ? Math.round((focusDays / dates.length) * 100)
        : 0;

      setFocusScore(score);
    } catch (error) {
      console.log(error);
    }
  };

  const getBadge = () => {
    if (streak >= 30)
      return {
        name: "Master Focuser",
        icon: <Crown size={30} />,
        color:
          "from-yellow-300 via-orange-400 to-red-500",
      };

    if (streak >= 15)
      return {
        name: "Gold",
        icon: <Trophy size={30} />,
        color:
          "from-yellow-400 via-amber-500 to-orange-500",
      };

    if (streak >= 7)
      return {
        name: "Silver",
        icon: <Medal size={30} />,
        color:
          "from-gray-200 via-gray-400 to-gray-600",
      };

    if (streak >= 3)
      return {
        name: "Bronze",
        icon: <Medal size={30} />,
        color:
          "from-orange-500 via-red-500 to-pink-500",
      };

    return {
      name: "Starter",
      icon: <Flame size={30} />,
      color:
        "from-purple-500 via-pink-500 to-cyan-500",
    };
  };

  const badge = getBadge();

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-[#0b1120] via-[#111827] to-black text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-6 items-center mb-12">

          <div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              🔥 Streak Arena
            </h1>

            <p className="opacity-60 mt-2 text-lg">
              Build discipline one day at a time
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-7 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 hover:scale-105"
            >
              {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>

            <button
              onClick={() => navigate("/home")}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 flex gap-2 items-center shadow-xl"
            >
              <ArrowLeft size={18} />
              Home
            </button>

          </div>
        </div>

        {/* MAIN STREAK CARD */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">

          <div className="rounded-[30px] p-10 bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl">

            <p className="text-xl opacity-70 mb-4">
              Current Streak
            </p>

            <h2 className="text-8xl font-black bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              {streak}
            </h2>

            <p className="text-lg opacity-70 mt-2">
              Consecutive days under limit
            </p>

            <div className="mt-8 flex gap-4">

              <div className="bg-white/10 rounded-2xl p-5 flex-1">
                <p className="opacity-60 text-sm">
                  Longest
                </p>

                <h3 className="text-4xl font-bold text-yellow-400">
                  {longestStreak}
                </h3>
              </div>

              <div className="bg-white/10 rounded-2xl p-5 flex-1">
                <p className="opacity-60 text-sm">
                  Focus Score
                </p>

                <h3 className="text-4xl font-bold text-purple-400">
                  {focusScore}%
                </h3>
              </div>

            </div>

          </div>

          {/* TODAY CARD */}
          <div className="rounded-[30px] p-10 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-400/20 shadow-2xl">

            <div className="flex justify-between items-start">

              <div>
                <p className="text-xl opacity-70">
                  Today's Usage
                </p>

                <h2 className="text-7xl font-black text-green-400 mt-3">
                  {todayUsage}
                </h2>

                <p className="opacity-70 text-lg mt-2">
                  / {dailyLimit} min allowed
                </p>
              </div>

              <Sparkles
                size={60}
                className="text-green-400"
              />

            </div>

            <div className="mt-8 h-4 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                style={{
                  width: `${Math.min(
                    (todayUsage / dailyLimit) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

          </div>

        </div>

        {/* BADGE */}
        <div
          className={`rounded-[30px] p-10 bg-gradient-to-r ${badge.color} shadow-2xl mb-10`}
        >
          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              {badge.icon}
            </div>

            <div>
              <p className="opacity-80 text-sm">
                Current Rank
              </p>

              <h2 className="text-4xl font-black">
                {badge.name}
              </h2>

              <p className="opacity-80 mt-1">
                Reach next streak level to unlock more
              </p>
            </div>

          </div>
        </div>

        {/* HISTORY */}
        <div>

          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Calendar size={28} />
            Daily Performance
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {history.slice(0, 9).map((item) => (
              <div
                key={item.date}
                className={`rounded-[26px] p-8 border backdrop-blur-xl shadow-xl transition hover:scale-105 ${
                  item.underLimit
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <p className="opacity-60 text-sm mb-3">
                  {format(
                    parseISO(item.date),
                    "MMM d, yyyy"
                  )}
                </p>

                <h3 className="text-5xl font-black">
                  {Math.round(item.totalMinutes)}
                </h3>

                <p className="opacity-70 mt-2">
                  min used
                </p>

                <div className="mt-5 text-lg font-semibold">
                  {item.underLimit
                    ? "✅ Success"
                    : "❌ Overused"}
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Streaks;