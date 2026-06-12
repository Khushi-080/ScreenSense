// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";
// import AuthPage from "./pages/AuthPage";
// import Timer from "./pages/Timer";
// import History from "./pages/History";
// import Index from "./pages/Index";
// //import Streaks from "./pages/Streaks";
// import Stats from "./pages/stats";

// function App() {

//   // 🔥 GLOBAL TIMER STATE
//   const [activeApp, setActiveApp] = useState(null);
//   const [seconds, setSeconds] = useState(0);
//   const [timerStatus, setTimerStatus] = useState("idle");

//   // 🔥 GLOBAL INTERVAL (never dies on navigation)
//   useEffect(() => {
//     let interval;

//     if (timerStatus === "running") {
//       interval = setInterval(() => {
//         setSeconds((prev) => prev + 1);
//       }, 1000);
//     }

//     return () => clearInterval(interval);
//   }, [timerStatus]);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AuthPage />} />
//         <Route path="/dashboard" element={<Index />} />

//         <Route
//           path="/timer"
//           element={
//             <Timer
//               activeApp={activeApp}
//               setActiveApp={setActiveApp}
//               seconds={seconds}
//               setSeconds={setSeconds}
//               timerStatus={timerStatus}
//               setTimerStatus={setTimerStatus}
//             />
//           }
//         />

//         <Route path="/history" element={<History />} />
//         <Route path="/stats" element={<Stats />} />
//         <Route path="/login" element={<AuthPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Pomodoro from "./pages/Pomodoro";
import Heatmap from "./pages/Heatmap";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import Timer from "./pages/Timer";
import History from "./pages/History";
import Stats from "./pages/stats";
import Streaks from "./pages/Streaks";

function App() {
  // 🔥 GLOBAL TIMER STATE
  const [activeApp, setActiveApp] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [timerStatus, setTimerStatus] = useState("idle");

  // 🔥 GLOBAL TIMER RUNS EVEN AFTER PAGE CHANGE
  useEffect(() => {
    let interval;

    if (timerStatus === "running") {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerStatus]);

  return (
    <Router>
      <Routes>
        {/* 🔐 FIRST PAGE LOGIN */}
        <Route path="/" element={<AuthPage />} />

        {/* 🏠 HOME PAGE AFTER LOGIN */}
        <Route path="/home" element={<Index />} />

<Route path="/pomodoro" element={<Pomodoro />} />
<Route path="/Heatmap" element={<Heatmap />} />
        {/* ⏱️ TIMER PAGE */}
        <Route
          path="/timer"
          element={
            <Timer
              activeApp={activeApp}
              setActiveApp={setActiveApp}
              seconds={seconds}
              setSeconds={setSeconds}
              timerStatus={timerStatus}
              setTimerStatus={setTimerStatus}
            />
          }
        />

        {/* 📜 HISTORY */}
        <Route path="/history" element={<History />} />

        {/* 📊 STATS */}
        <Route path="/stats" element={<Stats />} />

        <Route path="/streaks" element={<Streaks />} />
      </Routes>
    </Router>
  );
}

export default App;