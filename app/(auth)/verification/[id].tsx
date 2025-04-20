import React, { useEffect } from 'react';
import { useVerifyUserMutation } from '@/services/user.service';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import HandleResponse from '@/components/common/HandleResponse';
import { ActivityIndicator, Button } from 'react-native-paper';
import { StyleSheet, View, Text } from 'react-native';

const verification = () => {
  const { id: accountVerificationCode } = useLocalSearchParams();
  const [verifyUser, { data, isSuccess, isError, isLoading, error }] = useVerifyUserMutation();
  const router = useRouter();

  useEffect(() => {
    verifyUser({ accountVerificationCode });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => router.replace('/'), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <>
      <Stack.Screen options={{ title: 'User Verfication' }} />
      {/* <HandleResponse
        isError={isError}
        isSuccess={isSuccess}
        error={error || 'Error occurs'}
        message={data?.message}
      /> */}
      {isLoading ? <ActivityIndicator size="large" /> : 
      (
        <View style={styles.container}>
          <HandleResponse
            isError={isError}
            isSuccess={isSuccess}
            error={error || 'Error occurs'}
            message={data?.message}
          />
          
          {isSuccess ? (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>
                Verification is Successful!
              </Text>
              <Text>You'll be redirected automatically...</Text>
              <Button
                icon="login"
                mode = 'contained'
                onPress={() => router.replace('/')}>
                Go to Home
              </Button>
            </View>
          ) : isError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Verification Failed !
              </Text>
              <Button
                icon="login"
                mode = 'contained'
                onPress={() => router.replace('/')}>
                Go to Home
              </Button>
            </View>
          ) : null}
        </View>
      )
      }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  successContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  errorContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    marginBottom: 15,
    color: 'green',
  },
  errorText: {
    fontSize: 18,
    marginBottom: 15,
    color: 'red',
  },
  redirectText: {
    marginBottom: 15,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default verification;
