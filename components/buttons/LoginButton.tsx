import { router } from 'expo-router';
import React from 'react';
import { Button } from 'react-native-paper';

const LoginButton = () => {
  return (
    <Button
      icon="login"
      mode="text"
      onPress={() => {
        router.push('/login');
      }}>
      Login
    </Button>
  );
};

export default LoginButton;
