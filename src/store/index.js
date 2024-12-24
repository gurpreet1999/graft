import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/slices";
import jobReducer from "./job/slices";

export const store = configureStore({
  reducer: {
    user: userReducer,
    job: jobReducer,
  },
});
