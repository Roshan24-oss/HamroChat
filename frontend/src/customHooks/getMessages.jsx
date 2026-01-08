import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";

const useGetMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          { withCredentials: true }
        );

        // Ensure sender/receiver are objects
        const populated = res.data.map((msg) => ({
          ...msg,
          sender: typeof msg.sender === "object" ? msg.sender : { _id: msg.sender },
          receiver: typeof msg.receiver === "object" ? msg.receiver : { _id: msg.receiver },
        }));

        // Replace messages for current conversation
        dispatch(setMessages(populated));
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch]);
};

export default useGetMessages;
