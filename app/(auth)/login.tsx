import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Button, TextInput, Avatar, ActivityIndicator } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, useRouter } from 'expo-router';

import HandleResponse from '@/components/common/HandleResponse';
import { useLoginMutation } from '@/services/user.service';
import { setAuthData, userLogin, initializeWebSocket } from '@/store/slices/auth.slice';
import { logInSchema } from '@/utils/validation';
import { FormBuilder } from 'react-native-paper-form-builder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '@/hooks/useRedux';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [login, { data, isSuccess, isError, isLoading, error }] = useLoginMutation();

  const { control, setFocus, handleSubmit } = useForm<LoginFormData>({
    resolver: yupResolver(logInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  async function tryLocalSignin() {
    dispatch(
      setAuthData({
        token: null,
        success: false,
      })
    );
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      dispatch(
        setAuthData({
          token,
          success: true,
        })
      );
    } else {
      dispatch(
        setAuthData({
          token: null,
          success: false,
        })
      );
    }
  }

  useEffect(() => {
    tryLocalSignin();
  }, []);

  const onSubmit = ({ email, password }: LoginFormData) => {
    if (email && password) {
      login({
        body: { email, password },
      });
    }
  };

  const onSuccess = () => {
    if (data) {
      dispatch(userLogin(data));
      dispatch(initializeWebSocket(data));
      router.push('/');
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
              icon="account-plus"
              mode="contained"
              onPress={() => {
                router.push('/register');
              }}>
              Register
            </Button>
            <Button
              style={styles.button}
              icon="account-question"
              mode="contained"
              onPress={() => {}}>
              Forget Password
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
});

export default Login;
