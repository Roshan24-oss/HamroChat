import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoArrowBack } from "react-icons/io5";
import dp from "../assets/dp.webp";
import { setSelectedUser } from "../redux/userSlice";

const MessageArea = () => {
  const { selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  if (!selectedUser) {
    // Desktop will still show welcome
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-500">
          Welcome to HamroChat 👋
        </h1>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-white shadow-md">
        <IoArrowBack
          className="w-6 h-6 cursor-pointer hover:text-blue-500"
          onClick={() => dispatch(setSelectedUser(null))}
        />
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-400">
            <img
              src={selectedUser.image || dp}
              alt={selectedUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium">{selectedUser.name}</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-gray-500 italic">Start chatting with {selectedUser.name}...</p>
      </div>
    </div>
  );
};

export default MessageArea;
