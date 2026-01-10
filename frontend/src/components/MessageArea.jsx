import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoArrowBack, IoSend, IoImage } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";

import dp from "../assets/dp.webp";
import { setSelectedUser } from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import useGetMessages from "../customHooks/getMessages";
import { serverUrl } from "../main.jsx";

const MessageArea = ({ socket }) => {
  const dispatch = useDispatch();
  const { selectedUser, userData } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.message);

  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useGetMessages();

  const currentChatMessages = Array.isArray(messages)
    ? messages.filter(
        (m) =>
          (m.sender._id === selectedUser?._id && m.receiver._id === userData._id) ||
          (m.sender._id === userData._id && m.receiver._id === selectedUser?._id)
      )
    : [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (mess) => {
      dispatch(setMessages([...messages, mess]));
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, messages, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !userData || (!message && !image)) return;

    const formData = new FormData();
    formData.append("message", message);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );
      setMessage("");
      setImage(null);
      setPreviewUrl(null);
      setShowEmoji(false);

      dispatch(setMessages([...messages, res.data]));
    } catch (err) {
      console.error(err);
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
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      <div className="flex items-center gap-4 p-4 bg-white shadow">
        <IoArrowBack onClick={() => dispatch(setSelectedUser(null))} />
        <img src={selectedUser.image || dp} className="w-10 h-10 rounded-full" />
        <span>{selectedUser.name}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {currentChatMessages.map((m, i) =>
          m.sender._id === userData._id ? (
            <SenderMessage key={i} message={m.message} image={m.image} />
          ) : (
            <ReceiverMessage
              key={i}
              message={m.message}
              image={m.image}
              profile={selectedUser.image || dp}
            />
          )
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 flex flex-col gap-2 bg-white">
        {previewUrl && (
          <div className="relative w-32 h-32">
            <img src={previewUrl} alt="preview" className="object-cover w-full h-full rounded" />
            <button
              onClick={() => {
                setImage(null);
                setPreviewUrl(null);
              }}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <BsEmojiSmile onClick={() => setShowEmoji(!showEmoji)} className="text-xl" />
          <IoImage onClick={() => fileInputRef.current.click()} className="text-xl" />
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-full px-4 py-2"
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <IoSend onClick={handleSendMessage} className="text-2xl cursor-pointer" />
        </div>

        {showEmoji && <EmojiPicker onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)} />}
      </div>
    </div>
  );
};

export default MessageArea;
