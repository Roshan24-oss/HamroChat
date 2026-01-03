import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    otherUsers: null,
    selectedUser: null, // selected user for chat
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => { // Fixed name & logic
      state.selectedUser = action.payload;
    },
  },
});

export const { setUserData, setOtherUsers, setSelectedUser } = userSlice.actions;
export default userSlice.reducer;
