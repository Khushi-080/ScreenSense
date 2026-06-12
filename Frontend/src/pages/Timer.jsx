import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";
 import Navbar from "../components/Navbar";

const APPS = ["VsCode", "Telegram", "Instagram", "Snapchat", "Gmail", "YouTube"];

const APP_ICONS = {
  VsCode: "💻",
  Telegram : "💬",
  Instagram: "📸",
  Snapchat: "👻",
  Gmail: "📧",
  YouTube: "▶️",
};

const APP_URLS = {
  VsCode: "https://code.visualstudio.com/",
 Telegram: "https://web.telegram.org/",
  Instagram: "https://www.instagram.com",
  Snapchat: "https://accounts.snapchat.com",
  Gmail: "https://mail.google.com",
  YouTube: "https://www.youtube.com/",
};

const Timer = () => {
  //const today = new Date().toISOString().split("T")[0];
  const getToday = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};
  const [usageHistory, setUsageHistory] = useState([]);
  const [activeApp, setActiveApp] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [timerStatus, setTimerStatus] = useState("idle");
  const [blocked, setBlocked] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) ?? true
  );

  const [appLimits, setAppLimits] = useState(
    JSON.parse(localStorage.getItem("appLimits")) || {
      VsCode: 30,
      Telegram: 20,
      Instagram: 15,
      Snapchat: 10,
      Gmail: 30,
      YouTube: 30,
    }
  );

  const appWindowRef = useRef(null);
  const lastSavedSecondsRef = useRef(0);

  /* Save Settings */
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("appLimits", JSON.stringify(appLimits));
  }, [appLimits]);

useEffect(() => {
  loadTodayUsage();

  const interval = setInterval(() => {
    loadTodayUsage();
  }, 60000);

  return () => clearInterval(interval);
}, []);

const loadTodayUsage = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/history");

    const allData = res.data || [];

    const todayData = allData.filter(
      (item) => item.date === getToday()
    );

    setUsageHistory(todayData);

  } catch (error) {
    console.log("Error loading usage:", error);
  }
};

  /* Auto Daily Limit = Sum of all apps */
  const dailyLimit = Object.values(appLimits).reduce(
    (total, val) => total + val,
    0
  );

  /* Timer */
  useEffect(() => {
    let interval;
    if (timerStatus === "running") {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev +1 ;
          
          // Auto-save every 30 s
          if (newSeconds % 30 === 0 && newSeconds > 0 && activeApp) {
            saveCurrentProgress(activeApp, newSeconds);
          }
          
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timerStatus, activeApp]);

  /* Detect if app window is closed */
useEffect(() => {
  if (!activeApp || !appWindowRef.current) return;

  const interval = setInterval(() => {
    if (appWindowRef.current && appWindowRef.current.closed) {
      endSession();
    }
  }, 1000);

  return () => clearInterval(interval);
}, [activeApp]);

  /* Save before page unload */
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (activeApp && seconds >= 0) { 
        saveCurrentSession(activeApp, seconds, true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [activeApp, seconds]);

  /* Check for incomplete sessions on mount */
  useEffect(() => {
    const incompleteSession = JSON.parse(localStorage.getItem("incompleteSession"));
    if (incompleteSession && incompleteSession.date === getToday()) {
      
      if (window.confirm(`Restore your last session on ${incompleteSession.app}?`)) {
        setActiveApp(incompleteSession.app);
        setSeconds(incompleteSession.seconds);
        setTimerStatus("paused");
        setSessionStartTime(incompleteSession.startTime);
        setSessionId(incompleteSession.sessionId);
        
        const newWindow = window.open(APP_URLS[incompleteSession.app], "_blank");
        if (newWindow) {
          appWindowRef.current = newWindow;
        }
      }
      localStorage.removeItem("incompleteSession");
    }
  }, []);

  /* Save temp current progress if crash(updates the ongoing session) */
  const saveCurrentProgress = (app, currentSeconds) => {
    if (currentSeconds < 10 || Math.abs(currentSeconds - lastSavedSecondsRef.current) < 10) {
      return;
    }
    
    lastSavedSecondsRef.current = currentSeconds;
    
    // Store incomplete session for crash recovery
    localStorage.setItem("incompleteSession", JSON.stringify({
      app: app,
      seconds: currentSeconds,
      startTime: sessionStartTime || new Date().toISOString(),
      date: getToday(),
      sessionId: sessionId || `session-${Date.now()}`
    }));
  };

  /* Save final session to history */
/* Save final session to history */
const saveCurrentSession = async (app, currentSeconds) => {
  if (!app || currentSeconds < 5) return;

  const durationInMinutes = Number((currentSeconds / 60).toFixed(4));
  
  console.log("Saving:", { app, durationInMinutes, getToday }); // Debug

  try {
    const response = await axios.post("http://localhost:5000/api/history", {
      app: app,
      date: getToday(),
      duration: durationInMinutes,
      timestamp: new Date().toISOString(),
    });
    console.log("Save response:", response.data); // Debug
    
    await loadTodayUsage();
  } catch (error) {
    console.log("Save failed:", error.response?.data || error.message);
  }

  localStorage.removeItem("incompleteSession");
};
  /* Start App */
  const startApp = (app) => {
    if (timerStatus === "running" || blocked) return;

    const newWindow = window.open(APP_URLS[app], "_blank");
    if (!newWindow) return alert("Popup blocked!");

    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    appWindowRef.current = newWindow;
    setActiveApp(app);
    setSeconds(0);
    setTimerStatus("running");
    setSessionStartTime(new Date().toISOString());
    setSessionId(newSessionId);
    lastSavedSecondsRef.current = 0;
  };

  /* End Session */
const endSession = async () => {
  if (activeApp && seconds > 0) {
    await saveCurrentSession(activeApp, seconds);
  }

  if (appWindowRef.current && !appWindowRef.current.closed) {
    appWindowRef.current.close();
  }

  localStorage.removeItem("incompleteSession");
  lastSavedSecondsRef.current = 0;

  setActiveApp(null);
  setSeconds(0);
  setTimerStatus("idle");
  setSessionStartTime(null);
  setSessionId(null);
};


  /* App Limit check*/
 useEffect(() => {
  if (!activeApp || timerStatus !== "running") return;

  const limitSeconds = (appLimits[activeApp] || 0) * 60;

  if (limitSeconds > 0 && seconds >= limitSeconds) {
  endSession();

  }
}, [seconds, activeApp, timerStatus, appLimits]);

  /* Daily Limit Check,user gets blocked screen */
 
 const todayUsedSeconds =
  usageHistory
    .filter((session) => session.date === getToday())
    .reduce((total, session) => {
      console.log("Session data:", session); // Debug add karo
      return total + (session.duration * 60);
    }, 0) + seconds;

  // /* Cooldown Logic, user wait */
  // useEffect(() => {
  //   if (blocked) {
  //     setCooldown(60);
  //     const timer = setInterval(() => {
  //       setCooldown((prev) => {
  //         if (prev <= 1) {
  //           clearInterval(timer);
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //     }, 1000);
  //   }
  // }, [blocked]);

  /* Ring Calculations */
  const safeDailyLimit = dailyLimit > 0 ? dailyLimit : 1;
  const safeAppLimit =
    activeApp && appLimits[activeApp] > 0 ? appLimits[activeApp] : 1;

  const dailyCircumference = 2 * Math.PI * 90;
  const appCircumference = 2 * Math.PI * 70;

  const dailyPercent = Math.min(
    todayUsedSeconds / (safeDailyLimit * 60),
    1
  );
  const appPercent = Math.min(
    seconds / (safeAppLimit * 60),
    1
  );

  const dailyProgress = dailyCircumference * (1 - dailyPercent);
  const appProgress = appCircumference * (1 - appPercent);

  const dailyColor = dailyPercent > 0.8 ? "#ef4444" : "#f97316";
  const appColor = appPercent > 0.8 ? "#ef4444" : "#a855f7";

  const pauseResume = () => {
    if (timerStatus === "running") {
      setTimerStatus("paused");
    } else if (timerStatus === "paused") {
      setTimerStatus("running");
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#111827] to-black text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black"
      }`}
    >
      <Navbar darkMode={darkMode} toggleDark={() => setDarkMode(!darkMode)} />

      {/* Header */}
      <div className="text-center mt-8 mb-6">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
          ⏱️ Focus Timer
        </h1>
        <p className="text-lg opacity-70 mt-2">Track your screen time, stay productive</p>

        <div className="mt-4">
          <Link
            to="/pomodoro"
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all"
          >
            <span className="text-2xl">🍅</span>
            <span className="font-semibold">Pomodoro</span>
          </Link>
        </div>
      </div>

      {/* Total Usage Card */}
      <div className="flex justify-center gap-10 flex-wrap mb-14 mt-10">

        {/* Total Daily Limit Box */}
        <div className="relative shine-effect bg-white/10 backdrop-blur-xl px-12 py-8 rounded-3xl border border-purple-400/30 shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:scale-105 transition-all duration-300">
          <h2 className="text-xl font-semibold mb-2 opacity-80 flex items-center gap-2">
            <span className="text-2xl">🎯</span> Total Daily Limit
          </h2>

          <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            {dailyLimit} <span className="text-2xl opacity-70">min</span>
          </p>

          <p className="mt-3 text-sm opacity-70">
            Auto calculated from all apps
          </p>
          <div className="absolute top-4 right-4 text-4xl opacity-20">📊</div>
        </div>

        {/* Today's Usage Box */}
        <div className="relative shine-effect bg-white/10 backdrop-blur-xl px-12 py-8 rounded-3xl border border-yellow-400/30 shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:scale-105 transition-all duration-300">
          <h2 className="text-xl font-semibold mb-2 opacity-80 flex items-center gap-2">
            <span className="text-2xl">📱</span> Today's Usage
          </h2>

          <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
            {Math.floor(todayUsedSeconds / 60)} <span className="text-2xl opacity-70"></span>m
            {Math.floor(todayUsedSeconds % 60)}<span className="text-2xl opacity-70"></span>s
          </p>

          <p className="mt-3 text-sm opacity-70">
            Stay within your focus zone 🚀
          </p>
          <div className="absolute top-4 right-4 text-4xl opacity-20">⏰</div>
        </div>

      </div>

      {/* Active App */}
      {activeApp && (
        <div className="flex flex-col items-center mb-14">
          <h2 className="text-4xl font-bold mb-6 flex items-center gap-3 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            <span className="text-5xl">{APP_ICONS[activeApp]}</span> {activeApp}
          </h2>

          <div className="relative w-64 h-64">

            {/* Daily Ring */}
            <svg width="256" height="256" className="absolute inset-0">
              <circle cx="128" cy="128" r="90" stroke="rgba(255,255,255,0.1)" strokeWidth="14" fill="none"/>
              <circle
                cx="128"
                cy="128"
                r="90"
                stroke={dailyColor}
                strokeWidth="14"
                fill="none"
                strokeDasharray={dailyCircumference}
                strokeDashoffset={dailyProgress}
                strokeLinecap="round"
                transform="rotate(-90 128 128)"
                style={{
                  filter: `drop-shadow(0 0 12px ${dailyColor})`,
                  transition: "stroke-dashoffset 0.5s ease",
                }}
              />
            </svg>

            {/* App Ring */}
            <svg width="256" height="256" className="absolute inset-0">
              <circle cx="128" cy="128" r="70" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none"/>
              <circle
                cx="128"
                cy="128"
                r="70"
                stroke={appColor}
                strokeWidth="10"
                fill="none"
                strokeDasharray={appCircumference}
                strokeDashoffset={appProgress}
                strokeLinecap="round"
                transform="rotate(-90 128 128)"
                style={{
                  filter: `drop-shadow(0 0 12px ${appColor})`,
                  transition: "stroke-dashoffset 0.5s ease",
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {Math.floor(seconds / 60)}m
              </span>
              <span className="text-2xl opacity-80">{seconds % 60}s</span>
            </div>
          </div>

          <div className="mt-8 flex gap-6">
            <button
              onClick={pauseResume}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center gap-2"
            >
              <span className="text-xl">{timerStatus === "paused" ? "▶️" : "⏸️"}</span>
              {timerStatus === "paused" ? "Resume" : "Pause"}
            </button>

            <button
              onClick={endSession}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center gap-2"
            >
              <span className="text-xl">⏹️</span> Stop
            </button>
          </div>
        </div>
      )}

      {/* APP GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10 pb-20">
        {APPS.map((app, index) => (
          <div
            key={app}
            className="relative shine-effect p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:scale-105 transition-all duration-300 shadow-2xl"
            style={{
              boxShadow: `0 0 30px rgba(${index * 40}, ${100 + index * 30}, 255, 0.2)`,
            }}
          >
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-4xl">{APP_ICONS[app]}</span>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {app}
              </span>
            </h3>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="number"
                value={appLimits[app]}
                onChange={(e) =>
                  setAppLimits({ ...appLimits, [app]: Number(e.target.value) })
                }
                className="w-20 px-3 py-2 rounded-xl bg-black/30 text-white border border-white/20 focus:border-purple-400 outline-none"
              />
              <span className="opacity-70">minutes</span>
            </div>

            <button
              onClick={() => startApp(app)}
              disabled={timerStatus === "running" || blocked}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold disabled:opacity-40 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2"
            >
              <span>▶️</span> Start {app}
            </button>

            <div className="absolute top-4 right-4 text-3xl opacity-20">
              {APP_ICONS[app]}
            </div>
          </div>
        ))}
      </div>

      {/* Block Screen */}
      {blocked && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative shine-effect p-12 rounded-3xl text-center bg-white/10 backdrop-blur-xl border border-red-400/30 shadow-[0_0_60px_rgba(239,68,68,0.5)]">
            <h2 className="text-5xl mb-4">⏰</h2>
            <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text mb-4">
              Daily Limit Reached
            </h2>
            <p className="text-xl opacity-80 mb-8">Time to take a break! 🧘</p>
            <button
              onClick={() => setBlocked(false)}
              disabled={cooldown > 0}
              className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold disabled:opacity-40 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.3)] text-xl"
            >
              {cooldown > 0
                ? `⏳ Wait ${cooldown}s`
                : "✓ I Took a Break"}
            </button>
          </div>
        </div>
      )}

      {/* Add this style for the shine effect */}
      <style>{`
        .shine-effect {
          position: relative;
          overflow: hidden;
        }
        
        .shine-effect::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 20%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(25deg);
          animation: shine 6s infinite;
        }

        @keyframes shine {
          0% {
            left: -60%;
          }
          20% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Timer; 