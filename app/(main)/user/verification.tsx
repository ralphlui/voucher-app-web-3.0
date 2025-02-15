import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import HandleResponse from '@/components/common/HandleResponse';
import { useVerifyUserMutation } from '@/services/user.service';
import { ActivityIndicator } from 'react-native-paper';

const verification = () => {
  const { verifyid } = useLocalSearchParams();
  const [verifyUser, { data, isSuccess, isError, isLoading, error }] = useVerifyUserMutation();

  useEffect(() => {
    verifyUser({ verifyid });
  }, []);

  return (
    <>
      {(isSuccess || isError) && (
        <HandleResponse
          isError={isError}
          isSuccess={isSuccess}
          error={error || 'Error occurs'}
          message={data?.message}
        />
      )}
      {isLoading ? <ActivityIndicator size="large" /> : null}
    </>
  );
};

export default verification;
