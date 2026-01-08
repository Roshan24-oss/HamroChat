import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoArrowBack, IoSend, IoImage } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import dp from "../assets/dp.webp";
import { setSelectedUser } from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import useGetMessages from "../customHooks/getMessages";
import axios from "axios";
import { serverUrl } from "../main";

const MessageArea = () => {
  const dispatch = useDispatch();
  const { selectedUser, userData } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.message);

  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Fetch messages when selectedUser changes
  useGetMessages();

  // Filter messages for current conversation
  const currentChatMessages = messages.filter(
    (mess) =>
      (mess.sender._id === selectedUser?._id && mess.receiver._id === userData._id) ||
      (mess.sender._id === userData._id && mess.receiver._id === selectedUser?._id)
  );

  // Auto-scroll whenever current chat messages change
  useEffect(() => {
    if (chatEndRef.current) {
      window.requestAnimationFrame(() => {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [currentChatMessages]);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSendMessage = async () => {
    if (!message && !image) return;

    const formData = new FormData();
    formData.append("message", message || "");
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      // Ensure message has sender/receiver as objects
      const newMessage = {
        ...res.data,
        sender: res.data.sender._id ? res.data.sender : { _id: userData._id, name: userData.name },
        receiver: res.data.receiver._id
          ? res.data.receiver
          : { _id: selectedUser._id, name: selectedUser.name },
      };

      dispatch(setMessages([...messages, newMessage]));

      setMessage("");
      setImage(null);
      setShowEmoji(false);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
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
          className="w-6 h-6 cursor-pointer"
          onClick={() => dispatch(setSelectedUser(null))}
        />
        <div className="flex items-center gap-2">
          <img
            src={selectedUser.image || dp}
            alt={selectedUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium">{selectedUser.name}</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {currentChatMessages.length === 0 && (
          <p className="text-gray-500 italic">
            Start chatting with {selectedUser.name}...
          </p>
        )}

        {currentChatMessages.map((mess, index) =>
          mess.sender._id === userData._id ? (
            <SenderMessage key={index} {...mess} />
          ) : (
            <ReceiverMessage key={index} {...mess} />
          )
        )}

        {currentChatMessages.length > 0 && <div ref={chatEndRef}></div>}
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

      {/* Message Input */}
      <div className="p-4 bg-white flex items-center gap-3">
        <BsEmojiSmile
          className="text-2xl text-gray-500 hover:text-blue-500"
          onClick={() => setShowEmoji(!showEmoji)}
        />
        <IoImage
          className="text-2xl text-gray-500 hover:text-blue-500"
          onClick={() => fileInputRef.current.click()}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          hidden
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <IoSend
          className="text-2xl text-blue-500 hover:text-blue-700"
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default MessageArea;
