import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import ChatLayout from "./components/ChatLayout.jsx";

import getCurrentUser from "./customHooks/getCurrentUser.jsx";
import getOtherUsers from "./customHooks/getOtherUsers.jsx";

const App = () => {
  // Fetch current user and other users
  getCurrentUser();
  getOtherUsers();

  const { userData } = useSelector((state) => state.user);

  return (
    <Routes>
      {/* Login page */}
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />

      {/* SignUp page */}
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />

      {/* Main chat layout */}
      <Route
        path="/"
        element={userData ? <ChatLayout /> : <Navigate to="/login" />}
      />

      {/* Profile page */}
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signup" />}
      />

      {/* Optional fallback / home route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
