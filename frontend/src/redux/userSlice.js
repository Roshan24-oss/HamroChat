import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: undefined,
    otherUsers: [],
    selectedUser: null,
    socket: null,
    onlineUsers: [], // ✅ initialize as array
    usersWithNewMessages: [], // track users who sent messages
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      // Remove from usersWithNewMessages when selected
      state.usersWithNewMessages = state.usersWithNewMessages.filter(
        (u) => u._id !== action.payload?._id
      );
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addUserWithNewMessage: (state, action) => {
      const user = action.payload;
      // Avoid duplicates
      if (!state.usersWithNewMessages.find((u) => u._id === user._id)) {
        state.usersWithNewMessages.unshift(user);
      }
    },
  },
});

export const {
  setUserData,
  setOtherUsers,
  setSelectedUser,
  setSocket,
  setOnlineUsers,
  addUserWithNewMessage,
} = userSlice.actions;
export default userSlice.reducer;
