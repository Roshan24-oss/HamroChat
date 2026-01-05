import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoArrowBack, IoSend, IoImage } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import dp from "../assets/dp.webp";
import { setSelectedUser } from "../redux/userSlice";

const MessageArea = () => {
  const { selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [image, setImage] = useState(null);

  const fileInputRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSendMessage = () => {
    if (!message && !image) return;

    const data = {
      message: message || null,
      image: image ? image.name : null,
      sender: "myUserId123",
      receiver: selectedUser._id,
    };

    console.log("Sent Data 👉", data);

    setMessage("");
    setImage(null);
    setShowEmoji(false);
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-500">
          Welcome to HamroChat 👋
        </h1>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100 relative">
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
        <p className="text-gray-500 italic">
          Start chatting with {selectedUser.name}...
        </p>
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-24 left-4 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Image Preview */}
      {image && (
        <div className="px-4 pb-2">
          <div className="relative w-32">
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Message Input Bar */}
      <div className="p-4 bg-white flex items-center gap-3">
        {/* Emoji */}
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="text-2xl text-gray-500 hover:text-blue-500"
        >
          <BsEmojiSmile />
        </button>

        {/* Image */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="text-2xl text-gray-500 hover:text-blue-500"
        >
          <IoImage />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          hidden
        />

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Send */}
        <button
          onClick={handleSendMessage}
          className="text-2xl text-blue-500 hover:text-blue-700"
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default MessageArea;
