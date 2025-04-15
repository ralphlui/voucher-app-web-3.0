import React, { useEffect } from 'react';
import { useVerifyUserMutation } from '@/services/user.service';
import { Stack, useLocalSearchParams } from 'expo-router';
import HandleResponse from '@/components/common/HandleResponse';
import { ActivityIndicator } from 'react-native-paper';

const verification = () => {
  const { accountVerificationCode } = useLocalSearchParams();
  const [verifyUser, { data, isSuccess, isError, isLoading, error }] = useVerifyUserMutation();

  useEffect(() => {
    verifyUser({ accountVerificationCode });  // empty payload
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'User Verfication' }} />
      <HandleResponse
        isError={isError}
        isSuccess={isSuccess}
        error={error || 'Error occurs'}
        message={data?.message}
      />
      {isLoading ? <ActivityIndicator size="large" /> : null}
    </>
  );
};

export default verification;
