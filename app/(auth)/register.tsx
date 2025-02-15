import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Button, TextInput, Avatar, ActivityIndicator } from 'react-native-paper';
import { FormBuilder } from 'react-native-paper-form-builder';
import { MultiSelectDropdown } from 'react-native-paper-dropdown';

import HandleResponse from '@/components/common/HandleResponse';
import { useCreateUserMutation } from '@/services/user.service';
import { categories } from '@/utils/categories';

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
});

export default Register;
