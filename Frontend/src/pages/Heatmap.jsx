// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import {
//   motion,
//   AnimatePresence,
//   LayoutGroup,
// } from "framer-motion";

// const Heatmap = () => {
//   const [data, setData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [hoveredDate, setHoveredDate] = useState(null);
//   const [timeRange, setTimeRange] = useState("5");
//   const [showDetails, setShowDetails] = useState(false);

//   useEffect(() => {
//     loadHeatmap();
//   }, []);

//   const loadHeatmap = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(
//         "http://localhost:5000/api/history"
//       );

//       const sessions = res.data || [];
//       const grouped = {};

//       sessions.forEach((item) => {
//         const date = item.date;

//         if (!grouped[date]) grouped[date] = 0;

//         grouped[date] += item.duration;
//       });

//       setData(grouped);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPastDays = (days = 120) => {
//     const arr = [];

//     for (let i = days - 1; i >= 0; i--) {
//       const d = new Date();
//       d.setDate(d.getDate() - i);

//       const year = d.getFullYear();
//       const month = String(d.getMonth() + 1).padStart(2, "0");
//       const day = String(d.getDate()).padStart(2, "0");

//       arr.push(`${year}-${month}-${day}`);
//     }

//     return arr;
//   };

//   const getColor = (minutes) => {
//     if (!minutes) return "bg-gray-800";
//     if (minutes <= 30) return "bg-emerald-500";
//     if (minutes <= 90) return "bg-amber-500";
//     return "bg-red-500";
//   };

//   const getLabel = (minutes) => {
//     if (!minutes) return "No activity";
//     if (minutes <= 30) return "Focused";
//     if (minutes <= 90) return "Average";
//     return "Overused";
//   };

//   const calculateBestStreak = () => {
//     const sortedDates = Object.keys(data).sort();

//     let maxStreak = 0;
//     let currentStreak = 0;

//     for (let i = 0; i < sortedDates.length; i++) {
//       if (data[sortedDates[i]] > 0) {
//         currentStreak++;
//         maxStreak = Math.max(maxStreak, currentStreak);
//       } else {
//         currentStreak = 0;
//       }
//     }

//     return maxStreak;
//   };

//   const calculateCurrentStreak = () => {
//     const sortedDates = Object.keys(data).sort(
//       (a, b) => new Date(b) - new Date(a)
//     );

//     let streak = 0;

//     for (const date of sortedDates) {
//       if (data[date] > 0) streak++;
//       else break;
//     }

//     return streak;
//   };

//   const stats = {
//     totalDays: Object.keys(data).length,
//     focusDays: Object.values(data).filter(
//       (v) => v > 0 && v <= 30
//     ).length,
//     averageDays: Object.values(data).filter(
//       (v) => v > 30 && v <= 90
//     ).length,
//     overusedDays: Object.values(data).filter(
//       (v) => v > 90
//     ).length,
//     totalTime: Object.values(data).reduce(
//       (sum, v) => sum + v,
//       0
//     ),
//     avgTime:
//       Object.keys(data).length > 0
//         ? Object.values(data).reduce(
//             (sum, v) => sum + v,
//             0
//           ) / Object.keys(data).length
//         : 0,
//     bestStreak: calculateBestStreak(),
//     currentStreak: calculateCurrentStreak(),
//   };

//   const topDays = Object.entries(data)
//     .filter(([_, mins]) => mins > 0)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 5);

//   const days = getPastDays(parseInt(timeRange));

//   return (
//     <div className="min-h-screen bg-slate-900 text-white p-8">
//       <div className="max-w-7xl mx-auto">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
//           <h1 className="text-4xl font-bold">
//             📅 Productivity Heatmap
//           </h1>

//           <div className="flex gap-3">
//             <Link
//               to="/home"
//               className="px-5 py-2 bg-slate-700 rounded-xl"
//             >
//               Home
//             </Link>

//             <button
//               onClick={() =>
//                 setShowDetails(!showDetails)
//               }
//               className="px-5 py-2 bg-slate-700 rounded-xl"
//             >
//               {showDetails ? "Hide" : "Details"}
//             </button>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
//           {[
//             {
//               label: "Tracked Days",
//               value: stats.totalDays,
//             },
//             {
//               label: "Focus Days",
//               value: stats.focusDays,
//             },
//             {
//               label: "Avg Time",
//               value:
//                 stats.avgTime.toFixed(0) + "m",
//             },
//             {
//               label: "Best Streak",
//               value:
//                 stats.bestStreak + "d",
//             },
//             {
//               label: "Current Streak",
//               value:
//                 stats.currentStreak + "d",
//             },
//             {
//               label: "Total Time",
//               value:
//                 (
//                   stats.totalTime / 60
//                 ).toFixed(1) + "h",
//             },
//           ].map((item) => (
//             <div
//               key={item.label}
//               className="bg-slate-800 p-4 rounded-2xl"
//             >
//               <p className="text-sm opacity-70">
//                 {item.label}
//               </p>
//               <h2 className="text-2xl font-bold mt-2">
//                 {item.value}
//               </h2>
//             </div>
//           ))}
//         </div>

//         {/* Controls */}
//         <div className="mb-8 flex gap-4 flex-wrap">
//           <select
//             value={timeRange}
//             onChange={(e) =>
//               setTimeRange(e.target.value)
//             }
//             className="bg-slate-800 px-4 py-2 rounded-xl"
//           >
//             <option value="30">30 Days</option>
//             <option value="60">60 Days</option>
//             <option value="90">90 Days</option>
//             <option value="120">120 Days</option>
//           </select>

//           <button
//             onClick={loadHeatmap}
//             className="bg-emerald-600 px-4 py-2 rounded-xl"
//           >
//             Refresh
//           </button>
//         </div>

//         {/* Heatmap */}
//         <div className="bg-slate-800 p-6 rounded-3xl mb-8">
//           <h2 className="text-2xl font-bold mb-6">
//             Last {timeRange} Days
//           </h2>

//           {loading ? (
//             <p>Loading...</p>
//           ) : (
//             <>
//               <div className="grid grid-cols-15 gap-2">
//                 {days.map((date) => {
//                   const mins =
//                     data[date] || 0;

//                   return (
//                     <div
//                       key={date}
//                       onMouseEnter={() =>
//                         setHoveredDate(date)
//                       }
//                       onMouseLeave={() =>
//                         setHoveredDate(null)
//                       }
//                       className={`w-7 h-7 rounded-lg cursor-pointer ${getColor(
//                         mins
//                       )}`}
//                       title={`${date} - ${mins} mins`}
//                     />
//                   );
//                 })}
//               </div>

//               {/* Hover */}
//               {hoveredDate && (
//                 <div className="mt-4 text-sm opacity-80">
//                   {hoveredDate} —{" "}
//                   {data[hoveredDate] || 0} mins (
//                   {getLabel(
//                     data[hoveredDate] || 0
//                   )}
//                   )
//                 </div>
//               )}

//               {/* Legend */}
//               <div className="flex gap-3 mt-6 items-center">
//                 <span>Less</span>
//                 <div className="w-4 h-4 bg-gray-800 rounded"></div>
//                 <div className="w-4 h-4 bg-emerald-500 rounded"></div>
//                 <div className="w-4 h-4 bg-amber-500 rounded"></div>
//                 <div className="w-4 h-4 bg-red-500 rounded"></div>
//                 <span>More</span>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Top Days */}
//         <div className="bg-slate-800 p-6 rounded-3xl mb-8">
//           <h3 className="text-xl font-bold mb-4">
//             🏆 Top 5 Days
//           </h3>

//           {topDays.length === 0 ? (
//             <p>No data yet</p>
//           ) : (
//             <div className="space-y-3">
//               {topDays.map(
//                 ([date, mins], index) => (
//                   <div
//                     key={date}
//                     className="flex justify-between bg-slate-700 p-3 rounded-xl"
//                   >
//                     <span>
//                       #{index + 1}{" "}
//                       {new Date(
//                         date
//                       ).toLocaleDateString()}
//                     </span>

//                     <span>
//                       {mins.toFixed(0)}m
//                     </span>
//                   </div>
//                 )
//               )}
//             </div>
//           )}
//         </div>

//         {/* Details */}
//         {showDetails && (
//           <div className="bg-slate-800 p-6 rounded-3xl">
//             <h3 className="text-xl font-bold mb-4">
//               Detailed Insights
//             </h3>

//             <p>
//               Average Daily Time:{" "}
//               {stats.avgTime.toFixed(0)} mins
//             </p>

//             <p>
//               Total Hours:{" "}
//               {(stats.totalTime / 60).toFixed(
//                 1
//               )}{" "}
//               hrs
//             </p>

//             <p>
//               Best Streak:{" "}
//               {stats.bestStreak} days
//             </p>

//             <p>
//               Current Streak:{" "}
//               {stats.currentStreak} days
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Heatmap;







import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Heatmap = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [timeRange, setTimeRange] = useState("5");
  const [showDetails, setShowDetails] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    loadHeatmap();
  }, []);

  const loadHeatmap = async () => {
    try {
      setLoading(true);
      setAnimateStats(false);

      let grouped = {};

      try {
        const res = await axios.get(
          "http://localhost:5000/api/history"
        );

        const sessions = res.data || [];

        sessions.forEach((item) => {
          const date = item.date;

          if (!grouped[date]) grouped[date] = 0;

          grouped[date] += item.duration;
        });
      } catch (err) {
        console.log("Backend not running, demo mode");
      }

      /* Fake data if backend empty */
      if (Object.keys(grouped).length === 0) {
        for (let i = 0; i < 5; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);

          const year = d.getFullYear();
          const month = String(
            d.getMonth() + 1
          ).padStart(2, "0");
          const day = String(
            d.getDate()
          ).padStart(2, "0");

          const date = `${year}-${month}-${day}`;

          grouped[date] =
            Math.floor(Math.random() * 150) + 10;
        }
      }

      setData(grouped);

      setTimeout(() => {
        setAnimateStats(true);
      }, 200);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HELPERS ---------------- */

  const getPastDays = (days = 5) => {
    const arr = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const year = d.getFullYear();
      const month = String(
        d.getMonth() + 1
      ).padStart(2, "0");
      const day = String(
        d.getDate()
      ).padStart(2, "0");

      arr.push(`${year}-${month}-${day}`);
    }

    return arr;
  };

  const getColor = (mins) => {
    if (!mins) return "bg-gray-800";
    if (mins <= 30) return "bg-emerald-500";
    if (mins <= 90) return "bg-amber-500";
    return "bg-red-500";
  };

  const getLabel = (mins) => {
    if (!mins) return "No activity";
    if (mins <= 30) return "Focused";
    if (mins <= 90) return "Average";
    return "Overused";
  };

  const calculateBestStreak = () => {
    const sorted = Object.keys(data).sort();

    let best = 0;
    let current = 0;

    sorted.forEach((date) => {
      if (data[date] > 0) {
        current++;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
    });

    return best;
  };

  const calculateCurrentStreak = () => {
    const sorted = Object.keys(data).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    let streak = 0;

    for (const date of sorted) {
      if (data[date] > 0) streak++;
      else break;
    }

    return streak;
  };

  /* ---------------- STATS ---------------- */

  const stats = {
    totalDays: Object.keys(data).length,
    focusDays: Object.values(data).filter(
      (v) => v > 0 && v <= 30
    ).length,
    averageDays: Object.values(data).filter(
      (v) => v > 30 && v <= 90
    ).length,
    overusedDays: Object.values(data).filter(
      (v) => v > 90
    ).length,
    totalTime: Object.values(data).reduce(
      (sum, v) => sum + v,
      0
    ),
    avgTime:
      Object.keys(data).length > 0
        ? Object.values(data).reduce(
            (sum, v) => sum + v,
            0
          ) / Object.keys(data).length
        : 0,
    bestStreak: calculateBestStreak(),
    currentStreak: calculateCurrentStreak(),
  };

  /* Confetti after stats */
  useEffect(() => {
    if (
      stats.currentStreak > 0 &&
      stats.currentStreak % 5 === 0
    ) {
      setConfetti(true);

      setTimeout(() => {
        setConfetti(false);
      }, 2500);
    }
  }, [stats.currentStreak]);

  const topDays = Object.entries(data)
    .filter(([_, mins]) => mins > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const days = getPastDays(
    parseInt(timeRange)
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-4xl font-bold">
            📅 Productivity Heatmap
          </h1>

          <div className="flex gap-3">
            <Link
              to="/home"
              className="px-4 py-2 bg-slate-700 rounded-xl"
            >
              Home
            </Link>

            <button
              onClick={() =>
                setShowDetails(!showDetails)
              }
              className="px-4 py-2 bg-slate-700 rounded-xl"
            >
              {showDetails
                ? "Hide"
                : "Details"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            ["Tracked Days", stats.totalDays],
            ["Focus Days", stats.focusDays],
            [
              "Avg Time",
              stats.avgTime.toFixed(0) + "m",
            ],
            [
              "Best Streak",
              stats.bestStreak + "d",
            ],
            [
              "Current Streak",
              stats.currentStreak + "d",
            ],
            [
              "Total Time",
              (
                stats.totalTime / 60
              ).toFixed(1) + "h",
            ],
          ].map(([label, value]) => (
            <motion.div
              key={label}
              initial={{ scale: 0.9 }}
              animate={{
                scale: animateStats
                  ? 1
                  : 0.9,
              }}
              className="bg-slate-800 p-4 rounded-2xl"
            >
              <p className="text-sm opacity-70">
                {label}
              </p>
              <h2 className="text-2xl font-bold mt-2">
                {value}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
          <select
            value={timeRange}
            onChange={(e) =>
              setTimeRange(e.target.value)
            }
            className="bg-slate-800 px-4 py-2 rounded-xl"
          >
            <option value="5">
              5 Days
            </option>
            <option value="30">
              30 Days
            </option>
            <option value="60">
              60 Days
            </option>
          </select>

          <button
            onClick={loadHeatmap}
            className="bg-emerald-600 px-4 py-2 rounded-xl"
          >
            Refresh
          </button>
        </div>

        {/* Heatmap */}
        <div className="bg-slate-800 p-6 rounded-3xl mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Last {timeRange} Days
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="grid grid-cols-5 gap-3">
                {days.map((date) => {
                  const mins =
                    data[date] || 0;

                  return (
                    <div
                      key={date}
                      onMouseEnter={() =>
                        setHoveredDate(
                          date
                        )
                      }
                      onMouseLeave={() =>
                        setHoveredDate(
                          null
                        )
                      }
                      className={`h-14 rounded-xl cursor-pointer ${getColor(
                        mins
                      )}`}
                    ></div>
                  );
                })}
              </div>

              {hoveredDate && (
                <div className="mt-4 text-sm">
                  {hoveredDate} —{" "}
                  {data[
                    hoveredDate
                  ] || 0}{" "}
                  mins (
                  {getLabel(
                    data[
                      hoveredDate
                    ] || 0
                  )}
                  )
                </div>
              )}
            </>
          )}
        </div>

        {/* Top Days */}
        <div className="bg-slate-800 p-6 rounded-3xl mb-8">
          <h3 className="text-xl font-bold mb-4">
            🏆 Top Days
          </h3>

          {topDays.map(
            ([date, mins]) => (
              <div
                key={date}
                className="flex justify-between py-2 border-b border-slate-700"
              >
                <span>{date}</span>
                <span>
                  {mins} mins
                </span>
              </div>
            )
          )}
        </div>

        {/* Details */}
        {showDetails && (
          <div className="bg-slate-800 p-6 rounded-3xl">
            <p>
              Focus Days:{" "}
              {stats.focusDays}
            </p>
            <p>
              Average Days:{" "}
              {stats.averageDays}
            </p>
            <p>
              Overused Days:{" "}
              {stats.overusedDays}
            </p>
          </div>
        )}

        {/* Confetti */}
        <AnimatePresence>
          {confetti && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed top-5 right-5 text-4xl"
            >
              🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Heatmap;
