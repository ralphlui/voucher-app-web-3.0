import { router } from 'expo-router';
import React from 'react';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { userLogout } from '@/store/slices/auth.slice';
import { Platform, StyleSheet } from 'react-native';
import { useLogoutMutation } from '@/services/user.service';
import HandleResponse from '@/components/common/HandleResponse';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const [logout, { data, isSuccess, isError, isLoading, error }] = useLogoutMutation();
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
      <Button
        style={[Platform.OS === 'web' && styles.webStyle]}
        icon="logout"
        mode="contained"
        onPress={() => {
          logout({});
          dispatch(userLogout());
          router.push('/');
        }}>
        Logout
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  webStyle: {
    maxWidth: 300,
    alignSelf: 'center',
  },
});

export default LogoutButton;
