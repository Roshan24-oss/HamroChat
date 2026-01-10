import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import SideBar from "./SideBar";
import MessageArea from "./MessageArea";
import { io } from "socket.io-client";
import { setOnlineUsers } from "../redux/userSlice";
import { serverUrl } from "../main.jsx";

const ChatLayout = () => {
  const { selectedUser, userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);

  // 🔹 Socket ref
  const socketRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Connect socket when userData is available
  useEffect(() => {
    if (!userData?._id) return;

    socketRef.current = io(serverUrl, {
      query: { userId: userData._id },
    });

    socketRef.current.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userData?._id, dispatch]);

  return (
    <div className="flex h-screen w-screen">
      {/* Desktop: show both */}
      {!isMobile && (
        <>
          <SideBar />
          <MessageArea socket={socketRef.current} />
        </>
      )}

      {/* Mobile */}
      {isMobile && (
        <>
          {!selectedUser && <SideBar />}
          {selectedUser && <MessageArea socket={socketRef.current} />}
        </>
      )}
    </div>
  );
};

export default ChatLayout;
