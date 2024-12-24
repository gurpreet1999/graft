import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateMe, updateMePassword } from "../../firebase/user";

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (newUserData, { getState, thunkAPI }) => {
    try {
      const { user } = getState();
      await updateMe(newUserData, user.user);
    } catch (error) {
      thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  "user/updatePassword",
  async ({ currentPassword, newPassword }, thunkAPI) => {
    try {
      await updateMePassword(currentPassword, newPassword);
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
