import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Platform } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Extract token from URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const idToken = hashParams.get('id_token');
      console.log('Received token in callback:', idToken ? 'Token exists' : 'No token');

      if (idToken) {
        // Send token back to main window
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_SUCCESS', token: idToken }, '*');
          window.close();
        } else {
          // If no opener, redirect back to register
          console.log('No opener window found, redirecting to register');
          router.replace('/(auth)/login');
        }
      } else {
        console.log('No token found in URL');
        router.replace('/(auth)/login');
      }
    }
  }, []);

  // Show loading while processing
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}