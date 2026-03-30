import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for user state
interface UserState {
    isUserLoggedIn: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  authToken: string | null;
  preferences: {
    theme: string;
    language: string;
    notificationsEnabled: boolean;
  };
  recentActivity: any[]; // Can be modified based on actual data
}

// Initial state for the user slice
const initialState: UserState = {
    isUserLoggedIn: false,
  userId: null,
  userName: null,
  userEmail: null,
  authToken: null,
  preferences: {
    theme: "light",
    language: "en",
    notificationsEnabled: true,
  },
  recentActivity: [],
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsUserLoggedIn(state,action:PayloadAction<boolean>){
        state.isUserLoggedIn = action.payload;
      },
    setUserId(state, action: PayloadAction<string | null>) {
      state.userId = action.payload;
    },
    setUserName(state, action: PayloadAction<string | null>) {
      state.userName = action.payload;
    },
    setUserEmail(state, action: PayloadAction<string | null>) {
      state.userEmail = action.payload;
    },
    setAuthToken(state, action: PayloadAction<string | null>) {
      state.authToken = action.payload;
    },
    setUserPreferences(
      state,
      action: PayloadAction<Partial<UserState["preferences"]>>
    ) {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setRecentActivity(state, action: PayloadAction<any[]>) {
      state.recentActivity = action.payload;
    },
    resetUserState(state) {
      // Reset to initial state on logout or session expiration
      Object.assign(state, initialState);
    },
  },
});

// Export actions individually
export const {
    setIsUserLoggedIn,
  setUserId,
  setUserName,
  setUserEmail,
  setAuthToken,
  setUserPreferences,
  setRecentActivity,
  resetUserState,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
