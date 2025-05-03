import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Platform, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Avatar, Button, TextInput } from 'react-native-paper';

import { useAppDispatch } from '@/hooks/useRedux';
import { useValidateOtpMutation } from '@/services/user.service';
import { FormBuilder } from 'react-native-paper-form-builder';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthData, userLogin } from '@/store/slices/auth.slice';

interface TwoFaForm {
  otp: string;
}

const verifyCode = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.success);
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const message = 'Please key in your 6 digit code sent to your email within next 10 minutes.';

  const [validateOtp, { data, isSuccess, isError, isLoading, error }] = useValidateOtpMutation();

  useEffect(() => {
    if ( !isAuthenticated) {
      router.navigate('/login');
    }
  }, [isAuthenticated, router]);

  const { control, setFocus, handleSubmit } = useForm<TwoFaForm>({
    defaultValues: {
      otp: ''
    },
  });
  
  useEffect(() => {
    if (email){
      setFocus('otp');
    }
  }, [email, setFocus]);


  const onSubmit = async ({ otp }: TwoFaForm) => { 
    const storedEmail = await AsyncStorage.getItem('userEmail');
    if (!storedEmail) {
      console.error('Email is not retrieved or is empty! Cannot submit form.');
      return; 
    }
    setEmail(storedEmail);
    try{
      const response = await validateOtp({body: { email: storedEmail, otp: otp }}).unwrap();
      
      if (response.success){
        console.log('OTP validated successfully!');

        const token = document.cookie.startsWith('access_token=') 
        ? document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1] 
        : null;

        if (!token) {
          console.error('Token does not exist');
          return;
        }
        dispatch(userLogin({ token: token, data: response.data }));
        const expiryDuration = 5 * 60 * 1000; 
        dispatch(setAuthData({ token: token, success: true, expiryTime: Date.now() + expiryDuration }));
        router.push('/');
      }
    }
    catch (err){
      console.error('Error in validating OTP:  ', err);
    }
  }; 

  return (
    <>
      <Stack.Screen
        options={{
          title: '2FA',
        }}
      />
      <View style={[styles.containerStyle, Platform.OS === 'web' && styles.webStyle]}>
          <ScrollView contentContainerStyle={styles.scrollViewStyle}>
            <View style={styles.icon}>
              <Avatar.Icon icon="ticket-percent-outline" />
            </View>
            <View style={styles.instructionWrapper}>
              <Text>{message}</Text>
            </View>
            <FormBuilder
              control={control}
              setFocus={setFocus}
              formConfigArray={[
                {
                  name: 'otp',
                  type: 'text',
                  textInputProps: {
                    label: 'otp',
                    left: <TextInput.Icon icon="code-json" />,
                    keyboardType: 'numeric',
                    onChangeText: (text) => {
                      if (/^\d+$/.test(text)) {
                        setOtp(text);
                      }
                    },
                    value: otp, 
                  },
                  rules: {
                    required: 'OTP is required',
                    minLength: {
                      value: 6,
                      message: 'OTP key in must be at least 6 characters long',
                    },
                  },
                },
              ]}
            />
            <View style={styles.buttonContainer}>
              <Button
                style={styles.button}
                icon="keyboard-return"
                mode="contained"
                onPress={() => {router.navigate('/login')}}>
                Back
              </Button>
              <Button
                style={styles.button}
                icon="login"
                mode="contained"
                onPress={handleSubmit(onSubmit)}>
                Submit
              </Button>
            </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    width: '100%', 
    paddingHorizontal: 10, 
  },
  webStyle: {
    maxWidth: 300,
    alignSelf: 'center',
  },
});

export default verifyCode;
