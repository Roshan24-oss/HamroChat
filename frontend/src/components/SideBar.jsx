import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoLogOut, IoSearch } from "react-icons/io5";

import dp from "../assets/dp.webp";
import {
  setUserData,
  setOtherUsers,
  setSelectedUser,
} from "../redux/userSlice";
import { serverUrl } from "../main.jsx";

const SideBar = () => {
  const {
    userData,
    otherUsers,
    selectedUser,
    onlineUsers,
    usersWithNewMessages,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

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
      dispatch(setOtherUsers([]));
      dispatch(setSelectedUser(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const isOnline = (id) => onlineUsers?.includes(id);

  // Safe users (avoid bots without name)
  const safeUsers = otherUsers?.filter((u) => u.name);

  // Filter users by search
  const filteredUsers = safeUsers?.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Horizontal online users
  const onlineUserList = safeUsers?.filter((u) => isOnline(u._id));

  // Vertical list: prioritize users who sent new messages
  const verticalUsers = [
    ...usersWithNewMessages,
    ...safeUsers.filter(
      (u) =>
        !usersWithNewMessages.find((msgUser) => msgUser._id === u._id)
    ),
  ];

  return (
    <div className="flex flex-col lg:w-80 w-full h-screen bg-gray-50 shadow-lg">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-blue-600 p-4 rounded-b-3xl">
        <h1 className="text-white font-bold text-2xl">HamroChat</h1>
        <div className="flex items-center gap-4">
          <IoSearch
            className="text-white w-6 h-6 cursor-pointer"
            onClick={() => setSearchOpen(!searchOpen)}
          />
          <IoLogOut
            className="text-white w-6 h-6 cursor-pointer hover:text-red-400"
            onClick={handleLogOut}
          />
        </div>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center mt-4">
        <div ref={profileRef} className="relative">
          <div
            className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-400 cursor-pointer"
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
                className="w-full px-4 py-2 text-left hover:bg-blue-100"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
        <h2 className="mt-2 font-medium text-gray-800">{userData?.name}</h2>
      </div>

      {/* Search */}
      {searchOpen && (
        <div className="px-4 mt-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-md border focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      {/* Horizontal online users */}
      {!searchOpen && (
        <div className="flex gap-3 overflow-x-auto px-4 mt-4 py-2 border-b">
          {onlineUserList.length > 0 ? (
            onlineUserList.map((user) => (
              <div
                key={user._id}
                onClick={() => dispatch(setSelectedUser(user))}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-green-400 relative">
                  <img
                    src={user.image || dp}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <span className="text-xs mt-1">{user.name}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No users online</p>
          )}
        </div>
      )}

      {/* Vertical users */}
      <div className="flex-1 overflow-y-auto px-2 mt-4">
        {verticalUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => dispatch(setSelectedUser(user))}
            className={`flex items-center gap-3 p-2 mb-2 rounded-lg border cursor-pointer ${
              selectedUser?._id === user._id
                ? "bg-blue-100 border-blue-400"
                : "hover:bg-blue-50 border-gray-200"
            }`}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400 relative">
              <img
                src={user.image || dp}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              {isOnline(user._id) && (
                <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <span className="font-medium">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
