import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import authSlice from '@/store/slices/auth.slice';
import coreApi from '@/services/core.api';
import feedApi from '@/services/feed.api';
import userApi from '@/services/user.api';

export const store = configureStore({
  reducer: {
    [coreApi.reducerPath]: coreApi.reducer,
    [feedApi.reducerPath]: feedApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(coreApi.middleware)
      .concat(feedApi.middleware)
      .concat(userApi.middleware),
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
