import { Link } from "react-router-dom";
import { 
  Timer, 
  BarChart3, 
  Shield, 
  Zap, 
  Clock, 
  Calendar,
  ArrowRight, 
  Coffee,
  BookOpen,
  Sparkles,
  Flame,
  Target,
  TrendingUp,
  Moon,
  Sun,
  Github,
  Twitter,
  Heart
} from "lucide-react";
import { useState, useEffect } from "react";

const FEATURES = [
  {
    icon: Timer,
    title: "Smart Timer",
    desc: "Set custom limits per session. Get auto-locked when time's up.",
    color: "from-purple-400 to-pink-400",
    iconColor: "text-purple-400",
    glow: "rgba(168,85,247,0.2)",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    desc: "See your usage in beautiful charts. Track trends over time.",
    color: "from-blue-400 to-cyan-400",
    iconColor: "text-blue-400",
    glow: "rgba(59,130,246,0.2)",
  },
  {
    icon: Shield,
    title: "Break Enforcer",
    desc: "Forced break periods to keep you healthy and focused.",
    color: "from-pink-400 to-rose-400",
    iconColor: "text-pink-400",
    glow: "rgba(236,72,153,0.2)",
  },
  {
    icon: Zap,
    title: "Instant Launch",
    desc: "One click to start tracking and open any app directly.",
    color: "from-yellow-400 to-orange-400",
    iconColor: "text-yellow-400",
    glow: "rgba(245,158,11,0.2)",
  },
];

const STATS = [
  { value: "10k+", label: "Active Users", icon: TrendingUp, color: "from-green-400 to-emerald-400" },
  { value: "50k+", label: "Sessions Tracked", icon: Clock, color: "from-blue-400 to-cyan-400" },
  { value: "1M+", label: "Minutes Saved", icon: Target, color: "from-purple-400 to-pink-400" },
];

const Index = () => {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) ?? true
  );

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-all duration-700 relative overflow-hidden ${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#111827] to-black text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* Animated Background Glows */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                  <Timer className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-10 blur-lg group-hover:opacity-15 transition-opacity" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                  ScreenSense
                </h1>
                <p className="text-xs opacity-60">Mindful Digital Living</p>
              </div>
            </Link>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 rounded-full font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center gap-2"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span className="hidden sm:inline">{darkMode ? "Light" : "Dark"}</span>
              </button>

              <Link
                to="/timer"
                className="px-4 py-2 rounded-full font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center gap-2"
              >
                <Timer size={18} />
                <span className="hidden sm:inline">Timer</span>
              </Link>

              <Link
                to="/stats"
                className="px-4 py-2 rounded-full font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center gap-2"
              >
                <BarChart3 size={18} />
                <span className="hidden sm:inline">Stats</span>
              </Link>

               <Link
                to="/streaks"
                className="px-4 py-2 rounded-full font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.5)] flex items-center gap-2"
              >
                <Flame size={18} />
                <span className="hidden sm:inline">Streaks</span>
              </Link> 

              <Link
                to="/history"
                className="px-4 py-2 rounded-full font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center gap-2"
              >
                <BookOpen size={18} />
                <span classN ame="hidden sm:inline">History</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              ✨ Mindful Screen Time Management
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight">
            Take Control of Your{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                Digital Life
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full blur-sm"></div>
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Track app usage, enforce healthy breaks, and visualize your digital habits — 
            all in one beautiful dashboard. Join thousands of users reclaiming their focus.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
            <Link
              to="/timer"
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(168,85,247,0.5)]"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-15 group-hover:opacity-30 transition-opacity" />
            </Link>
            
            <Link
              to="/pomodoro"
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/20"
            >
              <Coffee className="w-5 h-5" />
              <span>Pomodoro</span>
            </Link>

            
            <Link
              to="/Heatmap"
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/20"
            >
              <Calendar className="w-5 h-5" />
              <span>Heatmap</span>
            </Link>

            <Link
              to="/stats"
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/20"
            >
              <BarChart3 className="w-5 h-5" />
              View Insights
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {STATS.map((stat, index) => (
              <div key={index} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <stat.icon className={`w-8 h-8 mb-3 mx-auto text-transparent bg-gradient-to-r ${stat.color} bg-clip-text`} />
                  <p className="text-3xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm opacity-60">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-4xl font-extrabold mb-2">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Stay Focused
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            Powerful features designed to help you build healthier digital habits
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="group relative"
            >
              {/* Glow Effect */}
              <div 
                className="absolute inset-0 rounded-2xl blur-l opacity-10 group-hover:opacity-20 transition-opacity duration-400"
                style={{ background: `radial-gradient(circle at center, ${feature.glow} 0%, transparent 50%)` }}
              />
              
              {/* Card */}
              <div className={`relative p-8 rounded-2xl backdrop-blur-xl border border-white/10 hover:scale-[1.02] transition-all duration-500 bg-white/5`}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-0.5`}>
                      <div className="w-full h-full rounded-xl bg-black/20 backdrop-blur-sm flex items-center justify-center">
                        <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                      </div>
                    </div>
                    <div className={`absolute -inset-1 rounded-xl bg-gradient-to-r ${feature.color} blur-lg opacity-50 group-hover:opacity-75 transition-opacity`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>

                {/* Decorative Line */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-0.5 bg-gradient-to-r ${feature.color} rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Simple{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              3-Step
            </span>{' '}
            Process
          </h2>
          <p className="text-xl text-gray-400">Start tracking your screen time in minutes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { step: "01", title: "Set Limits", desc: "Define time limits for each app you use", icon: Clock },
            { step: "02", title: "Track Usage", desc: "Start timer and use apps mindfully", icon: Timer },
            { step: "03", title: "Analyze & Improve", desc: "View stats and build better habits", icon: BarChart3 },
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <item.icon className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="relative bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
              Ready to Take Control?{' '}
              <Sparkles className="inline w-8 h-8 text-yellow-400 animate-pulse" />
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already transformed their digital habits
            </p>
            <Link
              to="/timer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition-all duration-300 font-bold text-xl shadow-[0_0_40px_rgba(168,85,247,0.5)] group"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-5 mb-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
                ScreenSense
              </h3>
              <p className="text-gray-400 mb-4">
                Mindful screen time management for a healthier digital life.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition">
                  <Twitter size={20} className="text-gray-400" />
                </a>
                <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition">
                  <Github size={20} className="text-gray-400" />
                </a>
                <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition">
                  <Heart size={20} className="text-gray-400" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/timer" className="hover:text-purple-400 transition">Timer</Link></li>
                <li><Link to="/stats" className="hover:text-purple-400 transition">Stats</Link></li>
                {/* <li><Link to="/streaks" className="hover:text-purple-400 transition">Streaks</Link></li> */}
                <li><Link to="/history" className="hover:text-purple-400 transition">History</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm pt-8 border-t border-white/10">
            Built with <Heart size={14} className="inline text-red-400" /> — ScreenSense © 2026
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 10s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-20px); opacity: 0.5; }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Index;