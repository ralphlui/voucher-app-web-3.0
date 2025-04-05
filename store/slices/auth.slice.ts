import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Auth } from '@/types/Auth';
import { RootState } from '@/store';
import { UserTypeEnum } from '@/types/UserTypeEnum';

interface WebSocketPayload {
  data: {
    userID: string;
    email: string;
    role: UserTypeEnum;
    username: string;
    authProvider: string;
    token: string;
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
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLogout: (state) => {
      AsyncStorage.removeItem('auth_token').catch((err) =>
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
    },
    userLogin: (
      state,
      action: PayloadAction<{token: string; data: WebSocketPayload['data'] }>) => {
      // const token = getCookie('access_token');
      // console.log('Token from cookie:', token); 
      const token = action.payload.token;

      if (token) {
        AsyncStorage.setItem('auth_token', token).catch((err) =>
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
    setAuthData: (state, action: PayloadAction<{ token: string | null; success: boolean }>) => {
      state.token = action.payload.token;
      state.success = action.payload.success;
    },
  },
});

export const { userLogout, userLogin, setAuthData } = authSlice.actions;

export default authSlice.reducer;
