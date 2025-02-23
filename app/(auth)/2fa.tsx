import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, Button, TextInput } from 'react-native-paper';

import HandleResponse from '@/components/common/HandleResponse';
import { useAppDispatch } from '@/hooks/useRedux';
import { useLoginMutation } from '@/services/user.service';
import { initializeWebSocket, userLogin } from '@/store/slices/auth.slice';
import { FormBuilder } from 'react-native-paper-form-builder';

interface TwoFaForm {
  code: string;
}

const verifyCode = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [login, { data, isSuccess, isError, isLoading, error }] = useLoginMutation();

  const { control, setFocus, handleSubmit } = useForm<TwoFaForm>({
    defaultValues: {
      code: '',
    },
  });

  useEffect(() => {
    setFocus('code');
  }, [setFocus]);

  const [code, setCode] = useState('');

  const onSubmit = () => {

  }; // to add logic to direct homepage

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
          title: '2FA',
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
                  name: 'code',
                  type: 'text',
                  textInputProps: {
                    label: 'code',
                    left: <TextInput.Icon icon="code-json" />,
                    keyboardType: 'numeric',
                    onChangeText: (text) => {
                      if (/^\d+$/.test(text) || text === '') {
                        setCode(text);
                      }
                    },
                    value: code, 
                  },
                },
              ]}
            />
            <Button
              style={styles.button}
              icon="login"
              mode="contained"
              onPress={handleSubmit(onSubmit)}>
              Submit
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

export default verifyCode;

