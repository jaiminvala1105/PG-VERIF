import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUser } from "../../context/AuthUserContext";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { __AUTH, __DB } from "../../backend/firebaseConfig";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaCamera,
  FaSave,
  FaTimes,
  FaPen,
  FaPhone,
  FaCalendar,
  FaGlobe,
  FaMapMarkerAlt,
  FaCity,
  FaFlag,
  FaTrash,
} from "react-icons/fa";

const Profile = () => {
  const { authusers } = useContext(AuthUser);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    photoURL: "",
    contactNumber: "",
    gender: "",
    dob: "",
    age: "",
    lang: "",
    country: "",
    state: "",
    city: "",
    address: "",
  });

  // Fetch user data from Firestore and sync with Auth
  useEffect(() => {
    const fetchUserData = async () => {
      if (authusers) {
        try {
          const userDocRef = doc(__DB, "users", authusers.uid);
          const userDocSnap = await getDoc(userDocRef);

          let firestoreData = {};
          if (userDocSnap.exists()) {
            firestoreData = userDocSnap.data();
          }

          setFormData({
            fullName: firestoreData.fullName || authusers.displayName || "",
            email: authusers.email || "",
            photoURL: firestoreData.photoURL || authusers.photoURL || "",
            contactNumber: firestoreData.contactNumber || "",
            gender: firestoreData.gender || "",
            dob: firestoreData.dob || "",
            age: firestoreData.age || "",
            lang: firestoreData.lang || "",
            country: firestoreData.country || "",
            state: firestoreData.state || "",
            city: firestoreData.city || "",
            address: firestoreData.address || "",
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load profile details");
        }
      }
    };

    fetchUserData();
  }, [authusers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "users_profiles");
    data.append("cloud_name", "dxmsic7rl");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxmsic7rl/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImage = await res.json();

      if (uploadedImage.secure_url) {
        setFormData((prev) => ({
          ...prev,
          photoURL: uploadedImage.secure_url,
        }));
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Cloudinary upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = () => {
    if (window.confirm("Are you sure you want to remove your profile photo?")) {
      setFormData((prev) => ({ ...prev, photoURL: "" }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!__AUTH.currentUser) throw new Error("No user logged in");
      const uid = __AUTH.currentUser.uid;

      // 1. Update Firebase Auth Profile (DisplayName & PhotoURL)
      await updateProfile(__AUTH.currentUser, {
        displayName: formData.fullName,
        photoURL: formData.photoURL,
      });

      // 2. Update Firestore User Document
      const userDocRef = doc(__DB, "users", uid);
      await setDoc(
        userDocRef,
        {
          ...formData,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const profileImage =
    formData.photoURL ||
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const inputClass = (isEditing) =>
    `block w-full pl-10 pr-3 py-3 sm:text-sm rounded-lg border focus:ring-blue-500 focus:border-blue-500 transition-colors text-white ${
      isEditing
        ? "border-indigo-600/50 bg-indigo-950/50"
        : "border-transparent bg-indigo-900/30 text-indigo-300"
    }`;

  return (
    <div className="min-h-screen bg-gray-950 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glow Effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto pt-8 relative z-10">
        <Toaster position="top-right" />

        {/* Animated Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl mb-3 tracking-tight">
            My Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500"></span>
          </h1>
          <p className="text-indigo-300 text-lg font-medium">
            Manage your personal information
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-indigo-900/60 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-indigo-700/50 transition-all duration-300 hover:border-indigo-600/70">
          {/* Gradient Header with Pattern */}
          <div className="h-40 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
            
            {/* Floating Shapes */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-20 w-32 h-32 bg-blue-300/5 rounded-full blur-2xl animate-pulse delay-700"></div>
          </div>

          <div className="px-6 sm:px-8 pb-8 relative">
            {/* Profile Image with Enhanced Styling */}
            <div className="relative -mt-20 mb-6 flex justify-center">
              <div className="relative group">
                <img
                  src={profileImage}
                  alt="Profile"
                  className={`w-36 h-36 rounded-full border-4 border-indigo-900 shadow-2xl object-cover bg-indigo-800 ring-4 ring-blue-500/30 transition-all duration-300 group-hover:ring-blue-500/50 ${
                    uploading ? "opacity-50" : ""
                  }`}
                  onError={(e) => {
                    e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                />

                {/* Upload Spinner Overlay */}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 z-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                )}

                {/* Edit Controls Overlay with Better Animation */}
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600/80 to-indigo-600/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100">
                    <label
                      htmlFor="photo-upload"
                      className="p-3 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer text-white mr-2 transition-all duration-200 hover:scale-110"
                      title="Change Photo"
                    >
                      <FaCamera size={18} />
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                    {formData.photoURL && (
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="p-3 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-all duration-200 hover:scale-110"
                        title="Remove Photo"
                      >
                        <FaTrash size={16} />
                      </button>
                    )}
                  </div>
                )}
                
                {/* Edit Badge */}
                {!isEditing && (
                  <div className="absolute bottom-2 right-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-full border-2 border-indigo-900 shadow-lg">
                    <FaPen size={12} />
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div className="bg-indigo-900/40 backdrop-blur-sm rounded-2xl p-6 border border-indigo-700/40 transition-all duration-300 hover:border-indigo-600/60 hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                      <FaUser className="text-white" size={18} />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-indigo-200 mb-1">
                        Full Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-indigo-400" />
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          disabled={!isEditing}
                          value={formData.fullName}
                          onChange={handleChange}
                          className={inputClass(isEditing)}
                          placeholder="Full Name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email (Read Only)
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          disabled
                          value={formData.email}
                          className={`${inputClass(false)} cursor-not-allowed`}
                        />
                      </div>
                    </div>

                    {/* Contact Number */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="contactNumber"
                          disabled={!isEditing}
                          value={formData.contactNumber}
                          onChange={handleChange}
                          className={inputClass(isEditing)}
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-3.5">
                          <FaUser className="text-gray-400" />
                        </div>
                        <select
                          name="gender"
                          disabled={!isEditing}
                          value={formData.gender}
                          onChange={handleChange}
                          className={`${inputClass(isEditing)} appearance-none`}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* DOB */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendar className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="dob"
                          disabled={!isEditing}
                          value={formData.dob}
                          onChange={handleChange}
                          className={inputClass(isEditing)}
                        />
                      </div>
                    </div>

                    {/* Age */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 font-bold text-xs">
                            #
                          </span>
                        </div>
                        <input
                          type="number"
                          name="age"
                          disabled={!isEditing}
                          value={formData.age}
                          onChange={handleChange}
                          className={inputClass(isEditing)}
                          placeholder="Age"
                        />
                      </div>
                    </div>

                    {/* Language */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaGlobe className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="lang"
                          disabled={!isEditing}
                          value={formData.lang}
                          onChange={handleChange}
                          className={inputClass(isEditing)}
                          placeholder="English, Hindi, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information Section */}
                <div className="bg-indigo-900/40 backdrop-blur-sm rounded-2xl p-6 border border-indigo-700/40 transition-all duration-300 hover:border-indigo-600/60 hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                      <FaMapMarkerAlt className="text-white" size={18} />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Location Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Address */}
                    <div className="relative md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <textarea
                          name="address"
                          rows="3"
                          disabled={!isEditing}
                          value={formData.address}
                          onChange={handleChange}
                          className={`${inputClass(isEditing)} pl-10`}
                          placeholder="Permanent Address"
                        ></textarea>
                      </div>
                    </div>

                    {/* City */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCity className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="city"
                          disabled={!isEditing}
                          value={formData.city}
                          onChange={handleChange}
                          className={inputClass(isEditing)}
                          placeholder="City"
                        />
                      </div>
                    </div>

                    {/* State */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="state"
                          disabled={!isEditing}
                          value={formData.state}
                          onChange={handleChange}
                          className={inputClass(isEditing)}
                          placeholder="State"
                        />
                      </div>
                    </div>

                    {/* Country */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaFlag className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="country"
                          disabled={!isEditing}
                          value={formData.country}
                          onChange={handleChange}
                          className={inputClass(isEditing)}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-indigo-700/40">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          window.location.reload();
                        }}
                        disabled={loading || uploading}
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-indigo-700 shadow-sm text-sm font-semibold rounded-xl text-indigo-200 bg-indigo-900/50 hover:bg-indigo-800/60 hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      >
                        <FaTimes className="mr-2" size={16} /> 
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || uploading}
                        className="inline-flex items-center justify-center px-10 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-xl shadow-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-600/60 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-xl"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent mr-2"></div>
                            <span className="font-semibold">Saving...</span>
                          </>
                        ) : (
                          <>
                            <FaSave className="mr-2" size={18} /> 
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center justify-center px-10 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-xl shadow-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-600/60 active:scale-95"
                    >
                      <FaPen className="mr-2" size={16} /> 
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
