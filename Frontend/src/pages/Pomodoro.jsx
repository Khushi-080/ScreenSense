import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Pomodoro = () => {
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem("pomodoroSettings")) || {
      focus: 25,
      shortBreak: 5,
      longBreak: 15,
      longAfter: 4,
    }
  );

  const [mode, setMode] = useState("focus");
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [completed, setCompleted] = useState(0);

  const getSeconds = (type) => {
    if (type === "focus") return settings.focus * 60;
    if (type === "short") return settings.shortBreak * 60;
    return settings.longBreak * 60;
  };

  const [seconds, setSeconds] = useState(getSeconds("focus"));

  useEffect(() => {
    localStorage.setItem(
      "pomodoroSettings",
      JSON.stringify(settings)
    );
  }, [settings]);

  useEffect(() => {
  if (!running) {
    setSeconds(getSeconds(mode));
  }
}, [settings, mode]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const notifyUser = (title, body) => {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/vite.svg", // optional
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
};

  const switchMode = () => {
    if (mode === "focus") {
      const nextCycle = cycles + 1;

      setCycles(nextCycle);
      setCompleted((prev) => prev + 1);

      if (nextCycle % settings.longAfter === 0) {
        setMode("long");
        setSeconds(getSeconds("long"));
        notifyUser(
          "Focus Complete 🎉",
          "Take a long break now."
        );
      } else {
        setMode("short");
        setSeconds(getSeconds("short"));
        notifyUser(
          "Focus Complete ✅",
          "Take a short break."
        );
      }
    } else {
      setMode("focus");
      setSeconds(getSeconds("focus"));
      notifyUser(
        "Break Over 💪",
        "Time to focus again."
      );
    }
  };

  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            switchMode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running, mode, cycles, settings]);

  const resetAll = () => {
    setRunning(false);
    setMode("focus");
    setCycles(0);
    setCompleted(0);
    setSeconds(getSeconds("focus"));
  };

  const formatTime = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${String(min).padStart(2, "0")}:${String(
      sec
    ).padStart(2, "0")}`;
  };

  const total = getSeconds(mode);
  const percent = seconds / total;
  const circumference = 2 * Math.PI * 110;
  const progress = circumference * (1 - percent);

  const color =
    mode === "focus"
      ? "#22c55e"
      : mode === "short"
      ? "#f59e0b"
      : "#a855f7";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-black text-white p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
          <h1 className="text-5xl font-black bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
             Pomodoro Mode
          </h1>

          <Link
            to="/home"
            className="px-7 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
          >
            Home
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Timer Card */}
          <div className="bg-white/10 rounded-3xl p-10 backdrop-blur-xl shadow-2xl">

            <p className="text-xl opacity-70 capitalize mb-6">
              {mode === "focus"
                ? "Focus Time"
                : mode === "short"
                ? "Short Break"
                : "Long Break"}
            </p>

            <div className="relative w-72 h-72 mx-auto mb-8">

              <svg width="288" height="288">
                <circle
                  cx="144"
                  cy="144"
                  r="110"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="14"
                  fill="none"
                />

                <circle
                  cx="144"
                  cy="144"
                  r="110"
                  stroke={color}
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={progress}
                  strokeLinecap="round"
                  transform="rotate(-90 144 144)"
                  style={{
                    transition:
                      "stroke-dashoffset 1s linear",
                    filter: `drop-shadow(0 0 12px ${color})`,
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center text-6xl font-black">
                {formatTime()}
              </div>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">

              <button
                onClick={() => setRunning(!running)}
                className="px-8 py-4 rounded-full bg-green-500"
              >
                {running ? "Pause" : "Start"}
              </button>

              <button
                onClick={resetAll}
                className="px-8 py-4 rounded-full bg-red-500"
              >
                Reset
              </button>

            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">

              <div className="bg-white/10 rounded-2xl p-5 text-center">
                <p className="opacity-60 text-sm">
                  Cycles
                </p>
                <h3 className="text-3xl font-bold">
                  {cycles}
                </h3>
              </div>

              <div className="bg-white/10 rounded-2xl p-5 text-center">
                <p className="opacity-60 text-sm">
                  Completed
                </p>
                <h3 className="text-3xl font-bold">
                  {completed}
                </h3>
              </div>

            </div>

          </div>

          {/* Settings Card */}
          <div className="bg-white/10 rounded-3xl p-10 backdrop-blur-xl shadow-2xl">

            <h2 className="text-3xl font-bold mb-8">
              ⚙ Customize Sessions
            </h2>

            <div className="space-y-6">

              <div>
                <label className="block mb-2 opacity-70">
                  Focus Minutes
                </label>

                <input
                  type="number"
                  value={settings.focus}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      focus: Number(
                        e.target.value
                      ),
                    })
                  }
                  className="w-full p-4 rounded-2xl text-black"
                />
              </div>

              <div>
                <label className="block mb-2 opacity-70">
                  Short Break
                </label>

                <input
                  type="number"
                  value={settings.shortBreak}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shortBreak: Number(
                        e.target.value
                      ),
                    })
                  }
                  className="w-full p-4 rounded-2xl text-black"
                />
              </div>

              <div>
                <label className="block mb-2 opacity-70">
                  Long Break
                </label>

                <input
                  type="number"
                  value={settings.longBreak}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      longBreak: Number(
                        e.target.value
                      ),
                    })
                  }
                  className="w-full p-4 rounded-2xl text-black"
                />
              </div>

              <div>
                <label className="block mb-2 opacity-70">
                  Long Break After Cycles
                </label>

                <input
                  type="number"
                  value={settings.longAfter}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      longAfter: Number(
                        e.target.value
                      ),
                    })
                  }
                  className="w-full p-4 rounded-2xl text-black"
                />
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Pomodoro;