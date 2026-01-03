import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoLogOut } from "react-icons/io5";

import dp from "../assets/dp.webp";
import { setUserData, setOtherUsers, setSelectedUser } from "../redux/userSlice";
import { serverUrl } from "../main";

const SideBar = () => {
  const { userData, otherUsers, selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      dispatch(setSelectedUser(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = otherUsers?.filter((user) =>
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onlineUsers = otherUsers?.filter((user) => user?.isOnline);

  return (
    <div className="flex flex-col lg:w-80 w-full h-screen bg-gray-50 shadow-lg">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-blue-600 p-4 rounded-b-3xl relative">
        <h1 className="text-white font-bold text-2xl">HamroChat</h1>
        <IoLogOut
          className="text-white w-7 h-7 cursor-pointer hover:text-red-400 transition"
          onClick={handleLogOut}
          title="Logout"
        />
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center mt-4">
        <div ref={profileRef} className="relative">
          <div
            className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-400 bg-white cursor-pointer"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            <img
              src={userData?.image || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          {profileMenuOpen && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-36 bg-white shadow-lg rounded-lg py-2 z-50">
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded-md"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <h2 className="mt-2 font-medium text-gray-800">{userData?.name || "User"}</h2>
      </div>

      {/* Search Bar */}
      <div className="px-4 mt-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Online Users */}
      <div className="flex gap-3 overflow-x-auto px-4 mt-4 py-2 border-b border-gray-200">
        {onlineUsers?.length > 0 ? (
          onlineUsers.map((user) => (
            <div
              key={user?._id}
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition transform"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-green-400 relative">
                <img
                  src={user?.image || dp}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <span className="text-xs mt-1">{user?.name}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No one online</p>
        )}
      </div>

      {/* Vertical User List */}
      <div className="flex-1 overflow-y-auto mt-4 px-2">
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user?._id}
              onClick={() => dispatch(setSelectedUser(user))}
              className={`flex items-center gap-3 p-2 mb-2 rounded-lg shadow-sm border cursor-pointer transition
                ${selectedUser?._id === user._id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-blue-50"}
              `}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400 relative">
                <img
                  src={user?.image || dp}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
                {user?.isOnline && (
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <span className="font-medium text-gray-800">{user?.name}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center mt-4">No users found</p>
        )}
      </div>
    </div>
  );
};

export default SideBar;
