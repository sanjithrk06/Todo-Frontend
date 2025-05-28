import React, { useState } from "react";
import { Mail, Lock, User, Github, LogIn, UserPlus } from "lucide-react";
import useStore from "./store";

const LoginRegister = ({ darkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const { handleEmailLogin, handleEmailRegister } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (isLogin) {
        await handleEmailLogin(formData);
      } else {
        await handleEmailRegister(formData);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-300 ${
          darkMode
            ? "bg-gray-800/90 border border-gray-700"
            : "bg-white/90 border border-white/20"
        }`}
      >
        <div className="text-center mb-8">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
              darkMode
                ? "bg-indigo-600"
                : "bg-gradient-to-r from-indigo-500 to-purple-600"
            }`}
          >
            {isLogin ? (
              <LogIn className="text-white" size={32} />
            ) : (
              <UserPlus className="text-white" size={32} />
            )}
          </div>
          <h1
            className={`text-3xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            {isLogin
              ? "Sign in to access your tasks"
              : "Sign up to start managing your tasks"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}
                size={20}
              />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <Mail
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
              size={20}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
          </div>

          <div className="relative">
            <Lock
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
              size={20}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 flex items-center">
          <hr className="flex-1 border-t" />
          <span
            className={`px-4 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Or continue with
          </span>
          <hr className="flex-1 border-t" />
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
            className={`w-full p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 mb-3 ${
              darkMode
                ? "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Mail size={20} className="text-red-500" />
            Continue with Google
          </button>

          <button
            onClick={() => window.location.href = "http://localhost:5000/api/auth/github"}
            className={`w-full p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
              darkMode
                ? "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Github size={20} />
            Continue with GitHub
          </button>
        </div>

        <p className="mt-8 text-center">
          <span
            className={darkMode ? "text-gray-400" : "text-gray-500"}
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-500 hover:text-indigo-600 font-medium"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;
