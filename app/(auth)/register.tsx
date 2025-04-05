import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { Stack, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { StyleSheet, View, ScrollView, Platform, Text } from 'react-native';
import { Button, TextInput, Avatar, ActivityIndicator } from 'react-native-paper';
import { MultiSelectDropdown } from 'react-native-paper-dropdown';
import { FormBuilder } from 'react-native-paper-form-builder';

import HandleResponse from '@/components/common/HandleResponse';
import { useCreateUserMutation, useGoogleRegisterMutation } from '@/services/user.service';
import { categories } from '@/utils/categories';

WebBrowser.maybeCompleteAuthSession();

const Register = () => {
  const router = useRouter();
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
      role: '',
      preferences: [],
    },
    mode: 'onChange',
  });

  const [createUser, { data, isSuccess, isError, isLoading, error }] = useCreateUserMutation();
  const [googleRegister] = useGoogleRegisterMutation();

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
    if (response?.type === 'success') {
      const { id_token } = response.params;
      console.log('=== Google Auth Success ===');
        console.log('ID Token:', id_token);
      handleGoogleSignIn(id_token);
    }
  }, [response]);

  const handleGoogleSignIn = async (token: string) => {
    try {
      const result = await googleRegister({
        body: { googleToken: token },
      }).unwrap();

      if (result) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  useEffect(() => {
    console.log(
      'Redirect URI:',
      Platform.select({
        web: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081',
        default: makeRedirectUri({
          native: 'voucher-app://',
        }),
      })
    );
  }, []);

  const onSuccess = () => {
    router.push('/login');
  };

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
                },
              ]}
            />
            <Controller
              name="preferences"
              control={control}
              render={({ field: { onChange, value } }) => (
                <MultiSelectDropdown
                  label="Preferences"
                  options={categories}
                  value={value}
                  onSelect={onChange}
                  mode="outlined"
                />
              )}
              rules={{
                required: {
                  value: true,
                  message: 'Preferences are required',
                },
              }}
            />
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleSubmit(({ username, email, password, role, preferences }) => {
                createUser({
                  body: { username, email, password, role, preferences },
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
