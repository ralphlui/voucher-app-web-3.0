import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

import LoginButton from '@/components/buttons/LoginButton';
import LogoutButton from '@/components/buttons/LogoutButton';
import useAuth from '@/hooks/useAuth';

const ProfileTab = () => {
  const auth = useAuth();

  return (
    <View style={styles.containerStyle}>
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
        {auth.success ? (
          <>
            <Text>{auth.user}</Text>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </ScrollView>
    </View>
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
});

export default ProfileTab;
