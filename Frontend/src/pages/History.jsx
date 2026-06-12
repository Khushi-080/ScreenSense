
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Default apps - but we'll also show any other apps that were tracked
const DEFAULT_APPS = [
  "VsCode",
  "Telegram",
  "Instagram",
  "Snapchat",
  "Gmail",
  "YouTube",
];

const DEFAULT_APP_ICONS = {
  VsCode: "💻",
  Telegram: "💬",
  Instagram: "📸",
  Snapchat: "👻",
  Gmail: "📧",
  YouTube: "▶️",
};

// Default icon for unknown apps
const DEFAULT_ICON = "📱";

const COLORS = [
  "#f97316", // Orange
  "#3b82f6", // Blue
  "#ec4899", // Pink
  "#a855f7", // Purple
  "#06b6d4", // Cyan
  "#eab308", // Yellow
  "#ef4444", // Red
  "#10b981", // Green
  "#6366f1", // Indigo
  "#14b8a6", // Teal
];

const History = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedApp, setSelectedApp] = useState("all");
  const [chartType, setChartType] = useState("bar");
  const [dateRange, setDateRange] = useState("all"); //last 7 days
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) ?? true
  );
  const [viewMode, setViewMode] = useState("chart");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateDetail, setShowDateDetail] = useState(false);
  const [allTrackedApps, setAllTrackedApps] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    avgPerSession: 0,
    mostUsedApp: "",
    mostUsedAppTime: 0,
    activeDays: 0,
    totalUniqueApps: 0,
    peakDay: "",
    peakUsage: 0,
    dailyAverage: 0,
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    loadRealData();
    
    // Listen for storage changes (updates from Timer)
    const handleStorageChange = () => {
      loadRealData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Refresh data every 2 seconds
    const interval = setInterval(loadRealData, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    filterAndSortData();
  }, [data, selectedApp, dateRange, sortOrder, searchTerm]);

  
    const loadRealData = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/history");
    const sessions = res.data || [];

    if (sessions.length === 0) {
      setData([]);
      setFilteredData([]);
      setAllTrackedApps([]);
      setStats({
        totalSessions: 0,
        totalMinutes: 0,
        avgPerSession: 0,
        mostUsedApp: "",
        mostUsedAppTime: 0,
        activeDays: 0,
        totalUniqueApps: 0,
        peakDay: "",
        peakUsage: 0,
        dailyAverage: 0,
      });
      return;
    }

    processData(sessions);
  } catch (error) {
    console.log("Error loading history:", error);
  }
};

  const getAppIcon = (appName) => {
    return DEFAULT_APP_ICONS[appName] || DEFAULT_ICON;
  };

  const processData = (sessions) => {
    // First, get all unique apps from sessions
    const uniqueApps = new Set();
    sessions.forEach(session => {
      if (session.app) {
        uniqueApps.add(session.app);
      }
    });
    
    const trackedAppsArray = Array.from(uniqueApps).sort();
    setAllTrackedApps(trackedAppsArray);
    
    // Group data by date
    const daily = {};
    const appTotals = {};
    let totalSessions = sessions.length;
    let totalMinutes = 0;

    sessions.forEach((session) => {
      const { date, app, duration } = session;
      
      if (!app || !date) return; // Skip invalid sessions
      
      totalMinutes += duration;

      // Track app totals
      if (!appTotals[app]) {
        appTotals[app] = 0;
      }
      appTotals[app] += duration;

      // Daily grouping
      if (!daily[date]) {
        daily[date] = { 
          date, 
          total: 0,
          sessions: [],
          apps: {}
        };
      }
      
      // Initialize app in this day if not exists
      if (!daily[date][app]) {
        daily[date][app] = 0;
      }
      
      daily[date][app] = (daily[date][app] || 0) + duration;
      daily[date].total += duration;
      daily[date].sessions.push(session);
      
      if (!daily[date].apps[app]) {
        daily[date].apps[app] = [];
      }
      daily[date].apps[app].push(session);
    });

    // Calculate stats
    let mostUsedApp = "";
    let mostUsedAppTime = 0;
    
    if (Object.keys(appTotals).length > 0) {
      mostUsedApp = Object.keys(appTotals).reduce((a, b) => 
        appTotals[a] > appTotals[b] ? a : b
      );
      mostUsedAppTime = appTotals[mostUsedApp];
    }

    // Find peak day
    let peakDay = "";
    let peakUsage = 0;
    const dailyArray = Object.values(daily);
    
    dailyArray.forEach(day => {
      if (day.total > peakUsage) {
        peakUsage = day.total;
        peakDay = day.date;
      }
    });

    const dailyAverage = dailyArray.length > 0 ? totalMinutes / dailyArray.length : 0;

    setStats({
      totalSessions,
      totalMinutes: Math.round(totalMinutes * 10) / 10,
      avgPerSession: totalSessions ? Math.round((totalMinutes / totalSessions) * 10) / 10 : 0,
      mostUsedApp,
      mostUsedAppTime: Math.round(mostUsedAppTime * 10) / 10 || 0,
      activeDays: dailyArray.length,
      totalUniqueApps: uniqueApps.size,
      peakDay,
      peakUsage: Math.round(peakUsage * 10) / 10,
      dailyAverage: Math.round(dailyAverage * 10) / 10,
    });

    // Convert daily object to array and sort by date
    const sortedDailyArray = dailyArray.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    setData(sortedDailyArray);
  };

  const filterAndSortData = () => {
    let filtered = [...data];

    // Filter by date range
    if (dateRange !== "all") {
      const today = new Date();
      const daysAgo = new Date();
      daysAgo.setDate(today.getDate() - parseInt(dateRange));
      
      filtered = filtered.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate >= daysAgo;
      });
    }

    // Filter by search term (date)
    if (searchTerm) {
      filtered = filtered.filter(day => 
        day.date.includes(searchTerm)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredData(filtered);
  };

  const getChartData = () => {
    if (selectedApp === "all") {
      return filteredData;
    } else {
      return filteredData.map(day => ({
        date: day.date,
        total: day[selectedApp] || 0,
        [selectedApp]: day[selectedApp] || 0,
      }));
    }
  };

  const getAppTotalsForPie = () => {
    const appTotals = {};
    
    data.forEach(day => {
      // Get all apps from this day
      Object.keys(day).forEach(key => {
        // Skip metadata keys
        if (key !== 'date' && key !== 'total' && key !== 'sessions' && key !== 'apps') {
          if (day[key] > 0) {
            appTotals[key] = (appTotals[key] || 0) + day[key];
          }
        }
      });
    });

    return Object.keys(appTotals)
      .filter(app => appTotals[app] > 0)
      .map(app => ({
        name: app,
        value: Math.round(appTotals[app] * 10) / 10,
        icon: getAppIcon(app)
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  };

  const exportData = async () => {
  try {
    //const res = await axios.get("http://localhost:5000/api/history");
    const fake = JSON.parse(localStorage.getItem("fakeHistory"));

if (fake) {
  setHistory(fake);
} else {
  const res = await axios.get("http://localhost:5000/api/history");
  setHistory(res.data);
}
    //const usageHistory = res.data || [];

    const dataStr = JSON.stringify(usageHistory, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," +
      encodeURIComponent(dataStr);

    const exportFileDefaultName =
      `screensense-history-${new Date()
        .toISOString()
        .split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

  } catch (error) {
    console.log("Export failed:", error);
  }
};
  
const clearHistory = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to clear all history?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete("http://localhost:5000/api/history");

    setData([]);
    setFilteredData([]);
    setAllTrackedApps([]);
    setSelectedDate(null);
    setShowDateDetail(false);

  } catch (error) {
    console.log("Delete failed:", error);
  }
};

  const viewDateDetail = (date) => {
    const dayData = data.find(d => d.date === date);
    setSelectedDate(dayData);
    setShowDateDetail(true);
  };

  const formatMinutes = (minutes) => {
  if (!minutes || minutes === 0) return "0s";

  const totalSeconds = Math.round(minutes * 60);

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
};

  // Get apps that have data in filtered range for charts
  const getAppsWithDataInRange = () => {
    const appsWithData = new Set();
    filteredData.forEach(day => {
      Object.keys(day).forEach(key => {
        if (key !== 'date' && key !== 'total' && key !== 'sessions' && key !== 'apps') {
          if (day[key] > 0) {
            appsWithData.add(key);
          }
        }
      });
    });
    return Array.from(appsWithData).sort();
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
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
          <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
              📜 ScreenSense History
            </h1>
            <p className="text-xl opacity-60 mt-2">
              {stats.totalSessions > 0 
                ? `${stats.totalSessions} sessions tracked across ${stats.activeDays} days` 
                : "No tracking data yet. Start using the timer!"}
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-7 py-3 rounded-full font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            >
              {darkMode ? " Light" : " Dark"}
            </button>

            <Link
              to="/stats"
              className="px-7 py-3 rounded-full font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
            >
               Stats
            </Link>

            <Link
              to="/timer"
              className="px-7 py-3 rounded-full font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
            >
             Timer
            </Link>
          </div>
        </header>

        {/* Stats Cards - Only show if data exists */}
        {stats.totalSessions > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="relative shine-effect bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-purple-400/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <p className="text-xl opacity-70">Total Sessions</p>
              <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                {stats.totalSessions}
              </p>
            </div>

            <div className="relative shine-effect bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-yellow-400/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <p className="text-xl opacity-70">Total Time</p>
              <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                {formatMinutes(stats.totalMinutes)}
              </p>
            </div>

            <div className="relative shine-effect bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <p className="text-xl opacity-70">Avg/Session</p>
              <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                {formatMinutes(stats.avgPerSession)}
              </p>
            </div>

            <div className="relative shine-effect bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-green-400/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <p className="text-xl opacity-70">Active Days</p>
              <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                {stats.activeDays}
              </p>
            </div>

            <div className="relative shine-effect bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-pink-400/30 shadow-[0_0_30px_rgba(236,72,153,0.2)] col-span-2">
              <p className="text-xl opacity-70">Most Used</p>
              <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text truncate">
                {stats.mostUsedApp} {getAppIcon(stats.mostUsedApp)} ({formatMinutes(stats.mostUsedAppTime)})
              </p>
            </div>
          </div>
        )}

        {/* Filters and Controls - Only show if data exists */}
        {stats.totalSessions > 0 && (
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              {/* App Filter */}
              <div>
                <label className="block text-xl opacity-70 mb-2">Filter by App</label>
                <select
                  value={selectedApp}
                  onChange={(e) => setSelectedApp(e.target.value)}
                  className="w-full px-8 py-7 rounded-xl bg-black/30 text-white border border-white/20 focus:border-purple-400 outline-none"
                >
                  <option value="all">📱 All Apps</option>
                  {allTrackedApps.map(app => (
                    <option key={app} value={app}>{getAppIcon(app)} {app}</option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-xl opacity-70 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-8 py-7 rounded-xl bg-black/30 text-white border border-white/20 focus:border-purple-400 outline-none"
                >
                  <option value="all">📅 All Time</option>
                  <option value="7">📆 Last 7 Days</option>
                  <option value="30">📆 Last 30 Days</option>
                  <option value="90">📆 Last 90 Days</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xl opacity-70 mb-2">Sort Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-8 py-7 rounded-xl bg-black/30 text-white border border-white/20 focus:border-purple-400 outline-none"
                >
                  <option value="desc">⬇️ Newest First</option>
                  <option value="asc">⬆️ Oldest First</option>
                </select>
              </div>

              {/* View Mode */}
              <div>
                <label className="block text-xl opacity-70 mb-2">View Mode</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setViewMode("chart")}
                    className={`flex-3 px-5 py-4 rounded-xl font-bold transition-all duration-300 ${
                      viewMode === "chart"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    📊 Chart
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-3 px-5 py-4 rounded-xl font-bold transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    📋 List
                  </button>
                </div>
              </div>

              {/* Chart Type (only when in chart mode)
              {viewMode === "chart" && (
                <div>
                  <label className="block text-xl opacity-70 mb-2">Chart Type</label>
                  <div className="flex gap-4">
                    
                    
                  </div>
                </div>
              )} */}
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col xl:flex-row gap-4 mt-4">
              <input
                type="text"
                placeholder="🔍 Search by date (YYYY-MM-DD)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-7 py-5 rounded-xl bg-black/30 text-white border border-white/20 focus:border-purple-400 outline-none"
              />

              <button
                onClick={exportData}
                className="px-6 py-2 rounded-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center gap-2 justify-center"
              >
                📥 Export Data
              </button>

              <button
                onClick={clearHistory}
                className="px-6 py-2 rounded-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center gap-2 justify-center"
              >
                🗑️ Clear History
              </button>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {stats.totalSessions === 0 && (
          <div className="bg-white/5 backdrop-blur-xl p-16 rounded-3xl border border-white/10 text-center mb-8">
            <div className="text-8xl mb-6">📊</div>
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
              No History Yet
            </h2>
            <p className="text-xl opacity-70 mb-8">
              Start tracking your screen time to see your history here!
            </p>
            <Link
              to="/timer"
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.5)] inline-block"
            >
              ⏱️ Go to Timer
            </Link>
          </div>
        )}

        {/* Main Content Area - Only show if data exists */}
        {stats.totalSessions > 0 && (
          <>
            {viewMode === "chart" ? (
              <>
                {/* Charts Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  {/* Main Chart */}
                  <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <span className="text-2xl">📈</span>
                      {selectedApp === "all" 
                        ? "All Apps Usage Over Time" 
                        : `${getAppIcon(selectedApp)} ${selectedApp} Usage`}
                    </h3>
                    
                    {filteredData.length === 0 ? (
                      <div className="h-[400px] flex items-center justify-center">
                        <p className="text-xl opacity-60 bg-white/5 px-8 py-4 rounded-2xl">
                          No data matches your filters ✨
                        </p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={400}>
                        {chartType === "bar" ? (
                          <BarChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                              dataKey="date" 
                              stroke={darkMode ? "#9ca3af" : "#4b5563"}
                              tick={{ fill: darkMode ? "#9ca3af" : "#4b5563" }}
                            />
                            <YAxis 
                              stroke={darkMode ? "#9ca3af" : "#4b5563"}
                              tick={{ fill: darkMode ? "#9ca3af" : "#4b5563" }}
                              label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: darkMode ? "#9ca3af" : "#4b5563" }}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                                border: "none",
                                borderRadius: "1rem",
                                boxShadow: "0 0 30px rgba(0,0,0,0.3)",
                              }}
                              labelStyle={{ color: darkMode ? "#ffffff" : "#000000" }}
                              formatter={(value) => [formatMinutes(value), "Duration"]}
                            />
                            <Legend />
                            {selectedApp === "all" ? (
                              getAppsWithDataInRange().map((appName, idx) => (
                                <Bar
                                  key={appName}
                                  dataKey={appName}
                                  name={`${getAppIcon(appName)} ${appName}`}
                                  fill={COLORS[idx % COLORS.length]}
                                  radius={[8, 8, 0, 0]}
                                  stackId="stack"
                                />
                              ))
                            ) : (
                              <Bar
                                dataKey={selectedApp}
                                name={`${getAppIcon(selectedApp)} ${selectedApp}`}
                                fill={COLORS[allTrackedApps.indexOf(selectedApp) % COLORS.length]}
                                radius={[8, 8, 0, 0]}
                              />
                            )}
                          </BarChart>
                        ) : (
                          <LineChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                              dataKey="date" 
                              stroke={darkMode ? "#9ca3af" : "#4b5563"}
                              tick={{ fill: darkMode ? "#9ca3af" : "#4b5563" }}
                            />
                            <YAxis 
                              stroke={darkMode ? "#9ca3af" : "#4b5563"}
                              tick={{ fill: darkMode ? "#9ca3af" : "#4b5563" }}
                              label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: darkMode ? "#9ca3af" : "#4b5563" }}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                                border: "none",
                                borderRadius: "1rem",
                                boxShadow: "0 0 30px rgba(0,0,0,0.3)",
                              }}
                              labelStyle={{ color: darkMode ? "#ffffff" : "#000000" }}
                              formatter={(value) => [formatMinutes(value), "Duration"]}
                            />
                            <Legend />
                            {selectedApp === "all" ? (
                              getAppsWithDataInRange().map((appName, idx) => (
                                <Line
                                  key={appName}
                                  type="monotone"
                                  dataKey={appName}
                                  name={`${getAppIcon(appName)} ${appName}`}
                                  stroke={COLORS[idx % COLORS.length]}
                                  strokeWidth={2}
                                  dot={{ fill: COLORS[idx % COLORS.length], r: 4 }}
                                  activeDot={{ r: 6 }}
                                />
                              ))
                            ) : (
                              <Line
                                type="monotone"
                                dataKey={selectedApp}
                                name={`${getAppIcon(selectedApp)} ${selectedApp}`}
                                stroke={COLORS[allTrackedApps.indexOf(selectedApp) % COLORS.length]}
                                strokeWidth={3}
                                dot={{ fill: COLORS[allTrackedApps.indexOf(selectedApp) % COLORS.length], r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            )}
                          </LineChart>
                        )}
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Pie Chart - App Distribution */}
                  <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                      <span className="text-2xl">🥧</span> App Distribution
                    </h3>
                    
                    {getAppTotalsForPie().length === 0 ? (
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-lg opacity-60">No app data yet</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={getAppTotalsForPie()}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, value, icon }) => 
                              `${icon} ${name}: ${formatMinutes(value)}`
                            }
                            labelStyle={{
                              fill: darkMode ? "#ffffff" : "#000000",
                              fontSize: "11px",
                              fontWeight: "500",
                            }}
                          >
                            {getAppTotalsForPie().map((entry, index) => (
                              <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                                style={{
                                  filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]})`,
                                }}
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [formatMinutes(value), "Total Time"]}
                            contentStyle={{
                              backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                              border: "none",
                              borderRadius: "1rem",
                              boxShadow: "0 0 30px rgba(0,0,0,0.3)",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Stats Summary */}
                  <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                      <span className="text-2xl">📊</span> Quick Stats
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                        <span className="opacity-70">Total Apps Used:</span>
                        <span className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-2xl">
                          {stats.totalUniqueApps}
                        </span>
                      </div>
                      
                      {stats.peakDay && (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                          <span className="opacity-70">Most Active Day:</span>
                          <span className="font-bold text-yellow-400">
                            {stats.peakDay}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                        <span className="opacity-70">Peak Usage:</span>
                        <span className="font-bold text-green-400">
                          {formatMinutes(stats.peakUsage)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                        <span className="opacity-70">Daily Average:</span>
                        <span className="font-bold text-blue-400">
                          {formatMinutes(stats.dailyAverage)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* List View */
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 mb-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <span className="text-3xl">📋</span> Daily Summary
                </h2>

                {filteredData.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-xl opacity-60 bg-white/5 px-8 py-4 rounded-2xl inline-block">
                      No data matches your filters.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {filteredData.map((day, index) => {
                    // Get all apps that have data for this day
                    const appsWithData = Object.keys(day).filter(key => 
                      key !== 'date' && key !== 'total' && key !== 'sessions' && key !== 'apps' && day[key] > 0
                    );
                    
                    const topApp = appsWithData.length > 0 
                      ? appsWithData.reduce((max, app) => day[app] > day[max] ? app : max, appsWithData[0])
                      : null;

                    return (
                      <div
                        key={index}
                        onClick={() => viewDateDetail(day.date)}
                        className="relative shine-effect bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:scale-[1.02] hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                                {day.date}
                              </span>
                              <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-400">
                                {day.sessions?.length || 0} sessions
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4">
                              <span className="text-lg">
                                Total: <span className="text-green-400 font-bold">{formatMinutes(day.total)}</span>
                              </span>
                              {topApp && (
                                <span className="text-sm opacity-70 flex items-center gap-1">
                                  <span>Top:</span>
                                  <span className="text-xl">{getAppIcon(topApp)}</span>
                                  <span className="font-semibold">{topApp}</span>
                                  <span className="text-yellow-400">({formatMinutes(day[topApp])})</span>
                                </span>
                              )}
                            </div>

                            {/* Mini app usage bars */}
                            {appsWithData.length > 0 && (
                              <div className="flex gap-1 mt-3">
                                {appsWithData.map(app => {
                                  const percentage = (day[app] / day.total) * 100;
                                  return (
                                    <div
                                      key={app}
                                      className="h-1 rounded-full"
                                      style={{
                                        width: `${percentage}%`,
                                        backgroundColor: COLORS[allTrackedApps.indexOf(app) % COLORS.length],
                                        boxShadow: `0 0 5px ${COLORS[allTrackedApps.indexOf(app) % COLORS.length]}`,
                                      }}
                                      title={`${app}: ${formatMinutes(day[app])}`}
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          
                          <button className="px-7 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-sm">
                            View Details →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Date Detail Modal */}
            {showDateDetail && selectedDate && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="relative max-w-2xl w-full bg-gradient-to-br from-[#1a1f35] to-[#0f1425] rounded-3xl border border-purple-400/30 shadow-[0_0_60px_rgba(168,85,247,0.3)] p-8">
                  <button
                    onClick={() => setShowDateDetail(false)}
                    className="absolute top-4 right-4 text-2xl opacity-50 hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>

                  <h2 className="text-3xl font-bold mb-2 text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                    {selectedDate.date}
                  </h2>
                  <p className="text-lg opacity-70 mb-6">
                    Total Time: <span className="text-green-400 font-bold">{formatMinutes(selectedDate.total)}</span>
                  </p>

                  <div className="space-y-4">
                    {Object.keys(selectedDate)
                      .filter(key => 
                        key !== 'date' && 
                        key !== 'total' && 
                        key !== 'sessions' && 
                        key !== 'apps' && 
                        selectedDate[key] > 0
                      )
                      .map((app, idx) => (
                        <div key={app} className="bg-white/5 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xl flex items-center gap-2">
                              <span>{getAppIcon(app)}</span>
                              <span className="font-semibold">{app}</span>
                            </span>
                            <span className="text-lg font-bold" style={{ color: COLORS[idx % COLORS.length] }}>
                              {formatMinutes(selectedDate[app])}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(selectedDate[app] / selectedDate.total) * 100}%`,
                                backgroundColor: COLORS[idx % COLORS.length],
                                boxShadow: `0 0 10px ${COLORS[idx % COLORS.length]}`,
                              }}
                            />
                          </div>
                          <p className="text-xs opacity-50 mt-1">
                            {selectedDate.sessions?.filter(s => s.app === app).length || 0} sessions
                          </p>
                        </div>
                      ))}
                  </div>

                  <button
                    onClick={() => setShowDateDetail(false)}
                    className="mt-7 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold hover:scale-105 transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Motivational Quote */}
            <div className="mt-8 text-center">
              <p className="text-lg opacity-60 bg-white/5 px-8 py-4 rounded-2xl inline-block backdrop-blur-sm">
                🎯 You've tracked {stats.totalSessions} sessions totaling {formatMinutes(stats.totalMinutes)}. Keep going!
              </p>
            </div>
          </>
        )}
      </div>

      {/* Add this style for the shine effect */}
      <style jsx>{`
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

export default History;