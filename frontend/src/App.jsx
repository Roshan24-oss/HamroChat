import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import ChatLayout from "./components/ChatLayout.jsx";

import useCurrentUser from "./customHooks/getCurrentUser.jsx";
import useGetOtherUsers from "./customHooks/getOtherUsers.jsx";

const App = () => {
  // ✅ Call hooks INSIDE component
  useCurrentUser();
  useGetOtherUsers();

  const { userData } = useSelector((state) => state.user);

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
        element={userData ? <ChatLayout /> : <Navigate to="/login" />}
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
