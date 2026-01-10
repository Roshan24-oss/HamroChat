import React, { useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";

import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import ChatLayout from "./components/ChatLayout.jsx";

import useCurrentUser from "./customHooks/getCurrentUser.jsx";
import useGetOtherUsers from "./customHooks/getOtherUsers.jsx";

import { setOnlineUsers } from "./redux/userSlice";
import { serverUrl } from "./main.jsx";

const App = () => {
  // Custom hooks
  useCurrentUser();
  useGetOtherUsers();

  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  // Socket reference
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userData?._id) return;

    // Connect socket
    socketRef.current = io(serverUrl, {
      query: { userId: userData._id },
    });

    // Listen for online users
    socketRef.current.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userData?._id, dispatch]);

  return (
    <Routes>
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={userData ? <ChatLayout socket={socketRef.current} /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signup" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
