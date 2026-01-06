import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { __AUTH } from "../backend/firebaseConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(__AUTH, formData.email, formData.password);
      
      await updateProfile(user, { displayName: formData.username });
      
      toast.success("Account created successfully!");
      navigate("/auth/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;