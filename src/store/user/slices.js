/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
