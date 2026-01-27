import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUser } from "../../context/AuthuserContext";
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
    `block w-full pl-10 pr-3 py-3 sm:text-sm rounded-lg border focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
      isEditing
        ? "border-gray-300 bg-white"
        : "border-transparent bg-gray-50 text-gray-500"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Toaster position="top-right" />

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My <span className="text-indigo-600">Profile</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your personal information
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative"></div>

          <div className="px-6 pb-8 relative">
            <div className="relative -mt-16 mb-6 flex justify-center">
              <div className="relative group">
                <img
                  src={profileImage}
                  alt="Profile"
                  className={`w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white ${
                    uploading ? "opacity-50" : ""
                  }`}
                  onError={(e) => {
                    e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                />

                {/* Upload Spinner Overlay */}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}

                {/* Edit Controls Overlay */}
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <label
                      htmlFor="photo-upload"
                      className="p-2 bg-white/20 hover:bg-white/40 rounded-full cursor-pointer text-white mr-2"
                      title="Change Photo"
                    >
                      <FaCamera />
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
                        className="p-2 bg-red-500/80 hover:bg-red-600/90 rounded-full text-white"
                        title="Remove Photo"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                )}
                {!isEditing && (
                  <div className="absolute bottom-2 right-2 bg-indigo-600 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                    <FaPen size={10} />
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-8">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 border-b pb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
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
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 border-b pb-2">
                    Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          // Re-trigger fetch or reset logic if needed, simplify by reloading page or just close for now
                          window.location.reload();
                        }}
                        disabled={loading || uploading}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      >
                        <FaTimes className="mr-2" /> Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || uploading}
                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          "Saving..."
                        ) : (
                          <>
                            <FaSave className="mr-2" /> Save Changes
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all hover:-translate-y-0.5"
                    >
                      <FaPen className="mr-2" /> Edit Details
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
