import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Auth } from '@/types/Auth';
import { UserTypeEnum } from '@/types/UserTypeEnum';

// interface WebSocketPayload {
//   data: {
//     userID: string;
//     email: string;
//     role: UserTypeEnum;
//     username: string;
//     authProvider: string;
//   };
// }

interface LoginPayload {
  token: string;
  refreshToken?: string;
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
  refreshToken: null,
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
      AsyncStorage.removeItem('refresh_token').catch((err) =>
        console.error('Error removing refresh token:', err)
      );
      state.user = null;
      state.userId = null;
      state.token = null;
      state.refreshToken = null; // Add this line
      state.success = false;
      state.error = null;
      state.role = null;
      state.email = null;
      state.authProvider = null;
      state.expiryTime = null;
    },
    userLogin: (state, action: PayloadAction<LoginPayload>) => {
      const { token, refreshToken, data } = action.payload;

      if (token) {
        AsyncStorage.setItem('access_token', token).catch((err) =>
          console.error('Error storing token:', err)
        );
        if (refreshToken) {
          AsyncStorage.setItem('refresh_token', refreshToken).catch((err) =>
            console.error('Error storing refresh token:', err)
          );
        }
      }
      state.token = token;
      state.refreshToken = refreshToken || null;
      state.success = true;
      state.email = data.email;
      state.role = data.role;
      state.user = data.username;
      state.userId = data.userID;
      state.authProvider = data.authProvider;
    },
    setAuthData: (
      state,
      action: PayloadAction<{ token: string | null; success: boolean; expiryTime: number | null }>
    ) => {
      state.token = action.payload.token;
      state.success = true;    // check if shld set to true
      state.expiryTime = action.payload.expiryTime;
      AsyncStorage.setItem('accessTokenExpiry', action.payload.expiryTime!.toString());
    },
  },
});

export const { userLogout, userLogin, setAuthData } = authSlice.actions;

export default authSlice.reducer;
