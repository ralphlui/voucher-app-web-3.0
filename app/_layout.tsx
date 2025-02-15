import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';

import { store } from '@/store';
import Toast from 'react-native-toast-message';
import FeedSnackbar from '@/components/snackbars/FeedSnackbar';

export default function RootLayout() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="(main)/(tabs)" options={{ title: 'Home', headerShown: false }} />
        </Stack>
        <FeedSnackbar />
        <Toast />
      </PaperProvider>
    </StoreProvider>
  );
}
