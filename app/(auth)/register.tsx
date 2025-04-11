import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { Stack, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View, ScrollView, Platform, Text } from 'react-native';
import { Button, TextInput, Avatar, ActivityIndicator } from 'react-native-paper';
import { FormBuilder } from 'react-native-paper-form-builder';

import HandleResponse from '@/components/common/HandleResponse';
import { useCreateUserMutation, useGoogleRegisterMutation } from '@/services/user.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userLogin } from '@/store/slices/auth.slice';
import { useDispatch } from 'react-redux';
import { UserTypeEnum } from '@/types/UserTypeEnum';

WebBrowser.maybeCompleteAuthSession();

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    formState: { errors },
    control,
    setFocus,
    handleSubmit,
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmedPassword: '',
      role: '',
    },
    mode: 'onChange',
  });
  const [createUser, { data, isSuccess, isError, isLoading, error }] = useCreateUserMutation();
  const [googleRegister] = useGoogleRegisterMutation();

  const onSuccess = () => {
    router.push('/login');
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    // androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    // iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    responseType: 'id_token',
    redirectUri: Platform.select({
      web: process.env.EXPO_PUBLIC_REDIRECT_URI,
      default: makeRedirectUri({
        native: 'voucher-app://',
      }),
    }),
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    console.log('=== Google Auth Configuration ===');
    console.log(
      'Redirect URI at Google Auth -> Register:',
      Platform.select({
        web: process.env.EXPO_PUBLIC_REDIRECT_URI,
        default: makeRedirectUri({
          native: 'voucher-app://',
        }),
      })
    );
    if (response?.type === 'success') {
      const { id_token } = response.params;
      console.log('=== Google Auth Success at Register ===');
      console.log('Google Auth ID Token:', id_token);
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
        console.log('User data after Google registration:', result.data);
        console.log('User ID after Google registration:', result.data.userID);
        console.log('Checking the document cookie : ', document.cookie);

        const cookies = document.cookie.split(';');
        const accessToken = cookies
          .find((cookie) => cookie.includes('access_token'))
          ?.split('=')[1];
        const refreshToken = cookies
          .find((cookie) => cookie.includes('refresh_token'))
          ?.split('=')[1];

        console.log('Access Token after register for role selection page call :', accessToken);
        console.log('Refresh Token after register for role selection page call :', refreshToken);

        //if (accessToken && refreshToken) {
        if (accessToken) {
          await AsyncStorage.setItem('access_token', accessToken);
          await AsyncStorage.setItem('refresh_token', accessToken);

          await dispatch(
            userLogin({
              token: accessToken,
              //refreshToken: refreshToken || null,
              data: {
                ...result.data,
                role: result.data.role as UserTypeEnum,
              },
            })
          );

          if (result.data.role === UserTypeEnum.UNDEFINED) {
            console.log('Navigating to role selection page...');
            router.push('/(auth)/roleSelection');
          } else {
            console.log('Navigating to home page...');
            router.push('/');
          }
        }
      }
    } catch (error) {
      console.error('Google registration error:', error);
    }
  };

  useEffect(() => {
    console.log(
      'Redirect URI:',
      Platform.select({
        web: process.env.EXPO_PUBLIC_REDIRECT_URI,
        default: makeRedirectUri({
          native: 'voucher-app://',
        }),
      })
    );
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Register',
        }}
      />
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error || 'Error occurs'}
          message={data?.message}
          onSuccess={onSuccess}
        />
      )}
      <View style={[styles.containerStyle, Platform.OS === 'web' && styles.webStyle]}>
        {isLoading ? (
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
              Sign up with Google
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
                  name: 'username',
                  type: 'text',
                  textInputProps: {
                    label: 'Username',
                    left: <TextInput.Icon icon="account" />,
                  },
                  rules: {
                    required: {
                      value: true,
                      message: 'Name is required',
                    },
                  },
                },
                {
                  name: 'email',
                  type: 'email',
                  textInputProps: {
                    label: 'Email',
                    left: <TextInput.Icon icon="email" />,
                  },
                  rules: {
                    required: {
                      value: true,
                      message: 'Email is required',
                    },
                    pattern: {
                      value:
                        /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
                      message: 'Email is invalid',
                    },
                  },
                },
                {
                  name: 'password',
                  type: 'password',
                  textInputProps: {
                    label: 'Password',
                    left: <TextInput.Icon icon="lock" />,
                  },
                  rules: {
                    required: {
                      value: true,
                      message: 'Password is required',
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
                      message:
                        'Password should contain at least 1 Uppercase letter, 1 Lowercase letter, 1 number and 1 special character',
                    },
                    minLength: {
                      value: 8,
                      message: 'Password should be atleast 8 characters',
                    },
                    maxLength: {
                      value: 30,
                      message: 'Password should be between 8 and 30 characters',
                    },
                  },
                },
                {
                  name: 'confirmedPassword',
                  type: 'password',
                  textInputProps: {
                    label: 'Confirm Password',
                    left: <TextInput.Icon icon="lock" />,
                  },
                  rules: {
                    required: {
                      value: true,
                      message: 'Password is required',
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
                      message:
                        'Password should contain at least 1 Uppercase letter, 1 Lowercase letter, 1 number and 1 special character',
                    },
                    minLength: {
                      value: 8,
                      message: 'Password should be atleast 8 characters',
                    },
                    maxLength: {
                      value: 30,
                      message: 'Password should be between 8 and 30 characters',
                    },
                  },
                },
                {
                  name: 'role',
                  type: 'select',
                  textInputProps: {
                    label: 'Usertype',
                    left: <TextInput.Icon icon="card-account-details" />,
                  },
                  rules: {
                    required: {
                      value: true,
                      message: 'User type is required',
                    },
                  },
                  options: [
                    {
                      value: 'MERCHANT',
                      label: 'Merchant',
                    },
                    {
                      value: 'CUSTOMER',
                      label: 'Customer',
                    },
                  ],
                  defaultValue: '',
                },
              ]}
            />
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleSubmit(({ username, email, password, role }) => {
                createUser({
                  body: { username, email, password, role },
                });
              })}>
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
  webStyle: {
    maxWidth: 300,
    alignSelf: 'center',
  },
  button: {
    marginTop: 20,
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
});

export default Register;
