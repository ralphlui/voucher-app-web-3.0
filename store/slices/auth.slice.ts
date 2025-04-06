import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Auth } from '@/types/Auth';
import { UserTypeEnum } from '@/types/UserTypeEnum';

interface WebSocketPayload {
  data: {
    userID: string;
    email: string;
    role: UserTypeEnum;
    username: string;
    authProvider: string;
  };
}

const initialState: Auth = {
  user: null,
  userId: null,
  token: null,
  success: false,
  error: null,
  role: null,
  email: null,
  message: null,
  authProvider: null,
  expiryTime: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLogout: (state) => {
      AsyncStorage.removeItem('access_token').catch((err) =>
        console.error('Error removing token:', err)
      );
      state.user = null;
      state.userId = null;
      state.token = null;
      state.success = false;
      state.error = null;
      state.role = null;
      state.email = null;
      state.authProvider = null;
      state.expiryTime = null;
    },
    userLogin: (
      state,
      action: PayloadAction<{token: string; data: WebSocketPayload['data'] }>) => {
      const token = action.payload.token;

      if (token) {
        AsyncStorage.setItem('access_token', token).catch((err) =>
          console.error('Error storing token:', err)
        );
      }
      state.token = token;
      state.success = true;
      state.email = action.payload.data.email;
      state.role = action.payload.data.role;
      state.user = action.payload.data.username;
      state.userId = action.payload.data.userID;
      state.authProvider = action.payload.data.authProvider;
    },
    setAuthData: (state, action: PayloadAction<{ token: string | null; success: boolean; expiryTime: number | null }>) => {
      state.token = action.payload.token;
      state.success = action.payload.success;
      state.expiryTime = action.payload.expiryTime;
      AsyncStorage.setItem('accessTokenExpiry', action.payload.expiryTime!.toString());
    },
  },
});

export const { userLogout, userLogin, setAuthData } = authSlice.actions;

export default authSlice.reducer;
