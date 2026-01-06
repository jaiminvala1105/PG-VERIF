import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { __AUTH } from "../backend/firebaseConfig";
import Spinner from "../helper/Spinner";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const { username, email, password, confirmPassword } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (password === confirmPassword) {
        const registeredUser = await createUserWithEmailAndPassword(
          __AUTH,
          email,
          password
        );

        await sendEmailVerification(registeredUser.user);

        await updateProfile(registeredUser.user, {
          displayName: username,
          photoURL:
            "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
        });

        toast.success(
          `Email verification sent to your registered email ${registeredUser.user.email}`
        );
        toast.success("Sign Up Successfully! Redirecting...");
        navigate("/auth/login");
      } else {
        toast.error("Passwords do not match");
      }
    } catch (error) {
      toast.error(error.code);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = `
    w-full bg-gray-800 border border-gray-700 p-2 rounded-lg text-white 
    outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
    transition-all duration-200 placeholder:text-gray-500 text-base
  `;

  return (
    <section className="w-full min-h-screen grow flex justify-center items-center p-4 bg-gray-50">
      <article className="w-full max-w-md bg-gray-900 text-white shadow-2xl rounded-2xl overflow-hidden">
        <header className="bg-indigo-700 py-4">
          <h1 className="text-3xl text-center font-bold tracking-tight">
            Create Account
          </h1>
          <p className="text-center text-indigo-200 text-sm mt-1">
            Join the EMS community today
          </p>
        </header>

        <main className="px-8 py-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username"
                className="text-sm font-medium text-white"
              >
                Full Name
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="John Doe"
                className={inputClasses}
                value={username}
                onChange={handleInputChange}
                required
              />
            </div>
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
                  type={showPassword1 ? "text" : "password"}
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
                  onClick={() => setShowPassword1(!showPassword1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword1 ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-white"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className={inputClasses}
                  value={confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword2 ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                </button>
              </div>
            </div>

            <button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg transform transition active:scale-[0.98]">
              Sign Up
            </button>

            <p className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <NavLink
                to="/auth/login"
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
              >
                Login
              </NavLink>
            </p>
          </form>
        </main>
      </article>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center">
            <Spinner />
            <p className="mt-4 text-black font-semibold text-lg animate-pulse">
              Redirecting to Login...
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default SignUp;
