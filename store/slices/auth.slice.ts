import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

let ws: WebSocket | null = null;

export const initializeWebSocket = createAsyncThunk<void, WebSocketPayload>(
  'auth/initializeWebSocket',
  async (payload, { dispatch, getState }) => {
    const state = getState() as RootState;
    ws = new WebSocket(
      `${process.env.EXPO_PUBLIC_FEED_SOCKET_URL}?userId=${payload.data.userID}`
    );
    ws.addEventListener('open', () => {
      console.log('Web Socket Session Opened.');
      ws?.send(JSON.stringify(payload.data));
    });
    ws.addEventListener('message', (event) => {
      console.log('Message received: ', event.data);
      const message = JSON.parse(event.data);
      dispatch(setWebSocketMessage(message));
    });
    ws.addEventListener('close', () => {
      console.log('WebSocket closed!');
    });
  }
);

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
    setWebSocketMessage: (state, action: PayloadAction<any>) => {
      state.message = action.payload;
    },
    setAuthData: (state, action: PayloadAction<{ token: string | null; success: boolean }>) => {
      state.token = action.payload.token;
      state.success = action.payload.success;
    },
  },
});

export const { userLogout, userLogin, setAuthData, setWebSocketMessage } = authSlice.actions;

export default authSlice.reducer;
