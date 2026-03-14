import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "../pages/LoginPage/types/loginTypes";

export interface UserProfileState {
  user: UserProfile | null;
}

const initialState: UserProfileState = {
  user: null,
};

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
    },
    clearUserProfile: (state) => {
      state.user = null;
    },
  },
});

export const { setUserProfile, clearUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
