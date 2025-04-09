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
  useGoogleLoginMutation,
} from '@/services/user.service';
import { userLogin } from '@/store/slices/auth.slice';
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
  const [googleLogin] = useGoogleLoginMutation();

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
    clientId: '815276630708-c7p3i5lo1bhm8r0lkg4qs00d49jocav8.apps.googleusercontent.com',
     webClientId: '815276630708-c7p3i5lo1bhm8r0lkg4qs00d49jocav8.apps.googleusercontent.com',
     responseType: 'id_token',
     redirectUri: Platform.select({
       web: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081',
       default: makeRedirectUri({
         native: 'voucher-app://',
       }),
     }),
     scopes: ['profile', 'email'],
  });

  useEffect(() => {
    // Log redirect URI when component mounts
    console.log('=== Google Auth Configuration ===');
    console.log(
      'Redirect URI:',
      Platform.select({
        web: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081',
        default: makeRedirectUri({
          native: 'voucher-app://',
        }),
      })
    );

    if (response) {
      console.log('=== Google Auth Response ===');
      console.log('Response type:', response.type);
      console.log('Full response:', response);

      if (response?.type === 'success') {
        const { id_token } = response.params;
        console.log('=== Google Auth Success at Login ===');
        console.log('ID Token:', id_token);

        // Send Google token to backend
        googleLogin({
          body: {
            token: id_token,
          },
        })
          .unwrap()
          .then((data) => {
            if (data.success) {
              console.log('=== Backend Response ===');
              console.log('Login success:', data);
              dispatch(userLogin(data));
              router.push('/');
            } else {
              console.error('=== Backend Error ===');
              console.error('Google login failed:', data.message);
            }
          })
          .catch((error) => {
            console.error('=== Backend Error ===');
            console.error('Google login failed:', error);
          });
      }
    }
  }, [response]);

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
        const response = await generateOtp({ body: { email: email } }).unwrap();
        console.log('OTP generated successfully:', response);
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
              Login with Google
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
