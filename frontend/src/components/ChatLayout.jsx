import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SideBar from "./SideBar";
import MessageArea from "./MessageArea";

const ChatLayout = () => {
  const { selectedUser } = useSelector((state) => state.user);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-screen">
      {/* Desktop: show both */}
      {!isMobile && (
        <>
          <SideBar />
          <MessageArea />
        </>
      )}

      {/* Mobile */}
      {isMobile && (
        <>
          {!selectedUser && <SideBar />}
          {selectedUser && <MessageArea />}
        </>
      )}
    </div>
  );
};

export default ChatLayout;
