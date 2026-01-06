import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { __AUTH } from "../backend/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import Spinner from "../helper/Spinner";

const Login = () => {
  let provider = new GoogleAuthProvider();
  let navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  let [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let signedInUser = await signInWithEmailAndPassword(
        __AUTH,
        email,
        password
      );

      let emailVerified = signedInUser?.user?.emailVerified;

      if (emailVerified === true) {
        toast.success("Welcome Back!");
        navigate("/");
      } else {
        toast.error("Please verify your email before login");
      }
    } catch (error) {
      toast.error(error.code.replace('auth/', ''));
    } finally {
      setLoading(false);
    }
  };

  let signInWithGoogle = async () => {
    try {
      await signInWithPopup(__AUTH, provider);
      navigate("/");
    } catch (error) {
      toast.error("Google Sign In Failed");
    }
  };

  const inputClasses = `
    w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-white 
    outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
    transition-all duration-200 placeholder:text-gray-500 text-base
  `;

  return (
    <section className="w-full min-h-screen grow flex justify-center items-center p-4 bg-gray-50">
      <article className="w-full max-w-md bg-gray-900 text-white shadow-2xl rounded-2xl overflow-hidden">
        <header className="bg-indigo-700 py-6">
          <h1 className="text-3xl text-center font-bold tracking-tight">
            Login
          </h1>
          <p className="text-center text-indigo-200 text-sm mt-1">
            Access your PG-VERIFY account
          </p>
        </header>

        <main className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="name@company.com"
                className={inputClasses}
                value={email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className={inputClasses}
                  value={password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-gray-300 cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>
              <NavLink
                to="/auth/forgot-password"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Forgot password?
              </NavLink>
            </div>

            <button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg transform transition active:scale-[0.98]">
              Login
            </button>

            <div className="text-center text-gray-400 text-sm mt-2">
              <p>
                Don't have an account?
                <NavLink
                  to="/auth/sign-up"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 ml-1"
                >
                  Sign Up
                </NavLink>
              </p>
            </div>
            <div
              onClick={signInWithGoogle}
              className="mt-2 flex items-center gap-2 justify-center border border-white p-2 rounded-full cursor-pointer transition-all duration-100 ease-linear hover:bg-white hover:text-black"
            >
              <span>
                <FcGoogle size={25} />
              </span>
              <span>Sign in with Google</span>
            </div>
          </form>
        </main>
      </article>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center">
            <Spinner />
            <p className="mt-4 text-black font-semibold text-lg animate-pulse">
              Authenticating...
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Login;
