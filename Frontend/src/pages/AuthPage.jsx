// import React, { useState } from 'react';
// import { motion } from 'framer-motion';

// export default function AuthPage(){
//  const [isLogin,setIsLogin]=useState(true);
//  const [showPass,setShowPass]=useState(false);
//  return (
//   <div className='min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center p-6'>
//    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className='w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl bg-white/5'>
//     <div className='p-10 flex flex-col justify-between bg-gradient-to-br from-purple-600/20 to-cyan-500/10'>
//       <div>
//         <h1 className='text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent'>ScreenSense</h1>
//         <p className='mt-4 text-white/70 text-lg'>Track habits. Build focus. Own your screen time.</p>
//       </div>
//       <div className='space-y-4 text-white/80'>
//         <div>📊 Smart analytics dashboard</div>
//         <div>⏱️ Focus timer & app limits</div>
//         <div>🔒 Secure personal account</div>
//       </div>
//     </div>
//     <div className='p-8 md:p-10'>
//       <div className='flex gap-2 mb-8 bg-white/5 p-1 rounded-2xl'>
//         <button onClick={()=>setIsLogin(true)} className={`flex-1 py-3 rounded-2xl font-semibold ${isLogin?'bg-gradient-to-r from-purple-500 to-pink-500':'text-white/70'}`}>Login</button>
//         <button onClick={()=>setIsLogin(false)} className={`flex-1 py-3 rounded-2xl font-semibold ${!isLogin?'bg-gradient-to-r from-cyan-500 to-blue-500':'text-white/70'}`}>Sign Up</button>
//       </div>
//       <form className='space-y-4'>
//         {!isLogin && <input className='w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none' placeholder='Full Name'/>}
//         <input className='w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none' placeholder='Email Address'/>
//         <div className='relative'>
//           <input type={showPass?'text':'password'} className='w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none pr-16' placeholder='Password'/>
//           <button type='button' onClick={()=>setShowPass(!showPass)} className='absolute right-4 top-3 text-sm text-white/70'>{showPass?'Hide':'Show'}</button>
//         </div>
//         {!isLogin && <input type='password' className='w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none' placeholder='Confirm Password'/>}
//         <button className={`w-full py-3 rounded-2xl font-bold mt-2 ${isLogin?'bg-gradient-to-r from-purple-500 to-pink-500':'bg-gradient-to-r from-cyan-500 to-blue-500'}`}>{isLogin?'Login to ScreenSense':'Create Account'}</button>
//       </form>
//       <div className='my-6 text-center text-white/50'>or continue with</div>
//       <button className='w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 transition'>🔗 Continue with Google</button>
//       <p className='text-center text-sm text-white/50 mt-6'>{isLogin?'New here?':'Already have an account?'} <button onClick={()=>setIsLogin(!isLogin)} className='text-cyan-300'>{isLogin?'Create account':'Login'}</button></p>
//     </div>
//    </motion.div>
//   </div>
//  )
// }









import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 Login Function
  const handleLogin = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    // later backend login yaha connect karna
    alert("Login Successful ✅");

    navigate("/home");
  };

  // 🔥 Signup Function
  const handleSignup = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Account Created ✅");

    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl bg-white/5"
      >
        {/* LEFT SIDE */}
        <div className="p-10 flex flex-col justify-between bg-gradient-to-br from-purple-600/20 to-cyan-500/10">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
              ScreenSense
            </h1>

            <p className="mt-4 text-white/70 text-lg">
              Track habits. Build focus. Own your screen time.
            </p>
          </div>

          <div className="space-y-4 text-white/80">
            <div>📊 Smart analytics dashboard</div>
            <div>⏱️ Focus timer & app limits</div>
            <div>🔒 Secure personal account</div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-10">
          {/* TOGGLE */}
          <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-2xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-2xl font-semibold ${
                isLogin
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "text-white/70"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-2xl font-semibold ${
                !isLogin
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                  : "text-white/70"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* FORM */}
          <form
            onSubmit={isLogin ? handleLogin : handleSignup}
            className="space-y-4"
          >
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none"
            />

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none pr-16"
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-3 text-sm text-white/70"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none"
              />
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-2xl font-bold mt-2 ${
                isLogin
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "bg-gradient-to-r from-cyan-500 to-blue-500"
              }`}
            >
              {isLogin ? "Login to ScreenSense" : "Create Account"}
            </button>
          </form>

          <div className="my-6 text-center text-white/50">
            or continue with
          </div>

          <button className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 transition">
            🔗 Continue with Google
          </button>

          <p className="text-center text-sm text-white/50 mt-6">
            {isLogin ? "New here?" : "Already have an account?"}

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-300 ml-2"
            >
              {isLogin ? "Create account" : "Login"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}