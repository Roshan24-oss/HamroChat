import React, { useState, useRef, useEffect } from "react";
import dp from "../assets/dp.webp";
import { IoCameraOutline, IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../main";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(userData?.name || "");
  const [frontendImage, setFrontendImage] = useState(userData?.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const imageInput = useRef();

  useEffect(() => {
    setFrontendImage(userData?.image || dp);
    setName(userData?.name || "");
  }, [userData]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.put(`${serverUrl}/api/user/profile`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(setUserData(result.data));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Profile update failed. Try again!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-200 flex flex-col items-center pt-10">
      <button
        className="self-start ml-5 mb-5 text-2xl text-gray-700 hover:text-blue-500"
        onClick={() => navigate("/")}
      >
        <IoArrowBack />
      </button>

      <div
        className="relative bg-white rounded-full border-4 border-blue-400 shadow-lg p-1 cursor-pointer"
        onClick={() => imageInput.current.click()}
      >
        <div className="w-48 h-48 rounded-full overflow-hidden">
          <img src={frontendImage} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <IoCameraOutline className="absolute bottom-2 right-2 text-gray-700 w-7 h-7 hover:text-blue-500" />
      </div>

      <form className="mt-8 w-80 flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md" onSubmit={handleProfile}>
        <input type="file" accept="image/*" ref={imageInput} hidden onChange={handleImage} />

        <input
          type="text"
          placeholder="Enter your name"
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          readOnly
          value={userData?.userName || ""}
          className="border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
        />

        <input
          type="email"
          readOnly
          value={userData?.email || ""}
          className="border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
        />

        <button
          type="submit"
          disabled={saving}
          className={`bg-blue-500 text-white rounded-md p-2 mt-2 transition ${saving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
