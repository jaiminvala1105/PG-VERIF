import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../helper/Spinner";
import { __AUTH } from "../backend/firebaseConfig";

const ForgotPassword = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  let [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      //! sendPasswordResetEmail()
      await sendPasswordResetEmail(__AUTH, email);
      toast.success("Reset password email link has been send!");
      navigate("/auth/login");
    } catch (error) {
      toast.error(error.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen grow flex justify-center items-center p-4 bg-gray-50">
      <article className="w-full max-w-lg bg-gray-900 text-white shadow-2xl rounded-2xl overflow-hidden">
        <header className="bg-indigo-700 py-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-indigo-200 text-sm mt-1 px-4">
            Enter your email address and we'll send you a link to reset your
            password.
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
                className={
                  "w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 text-base"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg transform transition active:scale-[0.98]">
              Send Reset Link
            </button>

            <div className="text-center text-gray-400 text-sm mt-2">
              <p>
                Remembered your password?
                <NavLink
                  to="/auth/login"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 ml-1"
                >
                  Back to Login
                </NavLink>
              </p>
            </div>
          </form>
        </main>
      </article>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-999">
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

export default ForgotPassword;
