import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View, ScrollView, Platform, Text } from 'react-native';
import { Button, TextInput, Avatar, ActivityIndicator } from 'react-native-paper';
import { FormBuilder } from 'react-native-paper-form-builder';

import HandleResponse from '@/components/common/HandleResponse';
import { useAppDispatch } from '@/hooks/useRedux';
import {
  useGenerateOtpMutation,
  useLoginMutation,
  useGoogleRegisterMutation,
} from '@/services/user.service';
import { setAuthData, userLogin } from '@/store/slices/auth.slice';
import { UserTypeEnum } from '@/types/UserTypeEnum';
import { logInSchema } from '@/utils/validation';

interface LoginFormData {
  email: string;
  password: string;
}

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [login, { data, isSuccess, isError, isLoading, error }] = useLoginMutation();
  const [generateOtp, { isLoading: isGeneratingOtp }] = useGenerateOtpMutation();
  const [googleRegister] = useGoogleRegisterMutation();

  const { control, setFocus, handleSubmit, reset } = useForm<LoginFormData>({
    resolver: yupResolver(logInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      reset({ email: '', password: '' });
    }, [reset])
  );

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    responseType: 'id_token',
    redirectUri: Platform.select({
      web: `${process.env.EXPO_PUBLIC_REDIRECT_URI}`,
      default: makeRedirectUri({
        native: 'voucher-app://',
      }),
    }),
    scopes: ['profile', 'email'],
  });

  // Add message listener for OAuth callback
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'OAUTH_SUCCESS') {
          handleGoogleSignIn(event.data.token);
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  useEffect(() => {
    console.log('=== Google Auth Configuration at Login ===');
    // console.log(
    //   'Redirect URI at Google Auth -> Login:',
    //   Platform.select({
    //     web: `${process.env.EXPO_PUBLIC_REDIRECT_URI}`,
    //     default: makeRedirectUri({
    //       native: 'voucher-app://',
    //     }),
    //   })
    // );
    if (response?.type === 'success') {
      const { id_token } = response.params;
      console.log('=== Google Auth Success at Login ===');
      //console.log('Google Auth ID Token:', id_token);
      handleGoogleSignIn(id_token);
    }
  }, [response]);

  const handleGoogleSignIn = async (token: string) => {
    try {
      const result = await googleRegister({
        body: { token },
      }).unwrap();

      console.log('=== Google Register Response ===', result);

      if (result.success) {
        console.log('Google auth successful, try to redirect the role selection page.');
        await AsyncStorage.setItem('user', JSON.stringify(result.data));
        //console.log('User data after Google registration:', result.data);
        //console.log('User ID after Google registration:', result.data.userID);
       // console.log('Checking the document cookie : ', document.cookie);

        const cookies = document.cookie.split(';');
        const accessToken = cookies
          .find((cookie) => cookie.includes('access_token'))
          ?.split('=')[1];
        const refreshToken = cookies
          .find((cookie) => cookie.includes('refresh_token'))
          ?.split('=')[1];

        //console.log('Access Token after register for role selection page call :', accessToken);

        //if (accessToken && refreshToken) {
        if (accessToken) {
          await AsyncStorage.setItem('access_token', accessToken);
          await AsyncStorage.setItem('refresh_token', accessToken);

          const loginPayload = {
            token: accessToken,
            refreshToken: undefined,
            data: {
              email: result.data.email,
              username: result.data.username,
              userID: result.data.userID,
              role: result.data.role as UserTypeEnum,
              authProvider: result.data.authProvider,
            },
          };

          dispatch(userLogin(loginPayload));

          if (result.data.role === UserTypeEnum.UNDEFINED) {
            console.log('Navigating to role selection page...');
            router.push('/(auth)/roleSelection');
          } else {
            console.log('Navigating to home page...');
            const expiryDuration = process.env.EXPO_PUBLIC_IS_PROD_ENV === 'true' ? 5 * 60 * 1000 : 15 * 60 * 1000; 
            dispatch(setAuthData({ token: accessToken, success: true, expiryTime: Date.now() + expiryDuration }));
            router.push('/');
          }
        }
      }
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  //This is for normal login
  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = async ({ email, password }: LoginFormData) => {
    if (email && password) {
      login({
        body: { email, password },
      });
      try {
        await AsyncStorage.setItem('userEmail', email);
        const response = await generateOtp({ body: { email } }).unwrap();
      } catch (err) {
        console.error('Error generating OTP:', err);
      }
    }
  };

  const onSuccess = () => {
    if (data) {
      dispatch(userLogin(data));
      router.push('/(auth)/2fa');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Login',
        }}
      />
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error || 'Error occurs'}
          onSuccess={onSuccess}
        />
      )}
      <View style={[styles.containerStyle, Platform.OS === 'web' && styles.webStyle]}>
        {isLoading || isGeneratingOtp ? (
          <ActivityIndicator size="large" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollViewStyle}>
            <View style={styles.icon}>
              <Avatar.Icon icon="ticket-percent-outline" />
            </View>
            <Button
              style={styles.button}
              icon="google"
              mode="contained"
              onPress={() => promptAsync()}
              disabled={!request}>
              Sign in with Google
            </Button>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>
            <FormBuilder
              control={control}
              setFocus={setFocus}
              formConfigArray={[
                {
                  name: 'email',
                  type: 'email',
                  textInputProps: {
                    label: 'Email',
                    left: <TextInput.Icon icon="email" />,
                  },
                },
                {
                  name: 'password',
                  type: 'password',
                  textInputProps: {
                    label: 'Password',
                    left: <TextInput.Icon icon="lock" />,
                  },
                },
              ]}
            />
            <Button
              style={styles.button}
              icon="login"
              mode="contained"
              onPress={handleSubmit(onSubmit)}>
              Login
            </Button>
            <Button
              style={styles.button}
              icon="account-question"
              mode="contained"
              onPress={() => {}}>
              Forget Password
            </Button>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>New Account?</Text>
              <View style={styles.divider} />
            </View>
            <Button
              style={[styles.button, styles.registerButton]}
              icon="account-plus"
              mode="contained"
              onPress={() => {
                router.push('/register');
              }}>
              Register
            </Button>
          </ScrollView>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  scrollViewStyle: {
    flex: 1,
    padding: 15,
  },
  headingStyle: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 40,
  },
  icon: {
    alignItems: 'center',
    margin: 10,
    padding: 10,
  },
  button: {
    marginBottom: 10,
  },
  webStyle: {
    maxWidth: 300,
    alignSelf: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#000',
  },
  dividerText: {
    marginHorizontal: 10,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 20,
  },
});

export default Login;
function googleRegister(arg0: { body: { token: string } }) {
  throw new Error('Function not implemented.');
}
