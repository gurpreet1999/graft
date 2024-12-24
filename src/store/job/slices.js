/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobs: [],
};

export const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    resetJobs: (state) => {
      state.jobs = [];
    },
  },
});

export const { setJobs, resetJobs } = jobSlice.actions;

export default jobSlice.reducer;
