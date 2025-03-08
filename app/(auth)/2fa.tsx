import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, TextInput } from 'react-native-paper';

import HandleResponse from '@/components/common/HandleResponse';
import { FormBuilder } from 'react-native-paper-form-builder';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface TwoFaForm {
  code: string;
}

const verifyCode = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.success);

  const { control, setFocus, handleSubmit, formState: { errors } } = useForm<TwoFaForm>({
    defaultValues: {
      code: '',
    },
  });

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  useEffect(() => {
    if (!isMounted && !isAuthenticated) {
      router.navigate('/login');
    }
  }, [isMounted, isAuthenticated, router]);
  
  useEffect(() => {
    setFocus('code');
  }, [setFocus]);

  const [code, setCode] = useState<string>('');

  const onSubmit = (data: TwoFaForm) => {
    if (data.code.length >= 6) {
      onSuccess();
    } else {
      alert('The code must be at least 6 characters long');
    }
  }; // to add logic to direct homepage (temporary use currently)

  const onSuccess = () => {
    router.push('/');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '2FA',
        }}
      />
      {(errors.code) && (
        <HandleResponse
          isError={true}
          message={errors.code?.message || 'Invalid Code'}
        />
      )}
      <View style={[styles.containerStyle, Platform.OS === 'web' && styles.webStyle]}>
          <ScrollView contentContainerStyle={styles.scrollViewStyle}>
            <View style={styles.icon}>
              <Avatar.Icon icon="ticket-percent-outline" />
            </View>
            <View style={styles.instructionWrapper}>
                Please key in your 6 digit code sent to your email.
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
                      if (/^\d+$/.test(text)) {
                        setCode(text);
                      }
                    },
                    value: code, 
                  },
                  rules: {
                    required: 'Code is required',
                    minLength: {
                      value: 6,
                      message: 'Code must be at least 6 characters long',
                    },
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  instructionWrapper: {
    marginBottom: 20,
    alignItems: 'center',
    textAlign: 'center',
    color: 'black',
  },
  instructionText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
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