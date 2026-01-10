import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      // Always append to array
      state.messages.push(action.payload);
    },
    replaceMessage: (state, action) => {
      const { tempId, message } = action.payload;
      const index = state.messages.findIndex((m) => m._id === tempId);
      if (index !== -1) state.messages[index] = message;
      else state.messages.push(message); // fallback
    },
  },
});

export const { setMessages, addMessage, replaceMessage } = messageSlice.actions;
export default messageSlice.reducer;
