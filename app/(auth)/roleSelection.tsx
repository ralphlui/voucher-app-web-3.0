import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, RadioButton, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { useUpdateUserRoleMutation } from '@/services/user.service';
import { UserTypeEnum } from '@/types/UserTypeEnum';

export default function RoleSelection() {
  const [role, setRole] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const [updateUserRole] = useUpdateUserRoleMutation();

  useEffect(() => {
    // Check if we have the necessary user data on mount
    const checkUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      console.log('User data in role selection:', userData);
    };
    checkUserData();
  }, []);

  const handleSubmit = async () => {
    try {
      console.log('Submitting role:', role);
      // Get the stored Google user info
      const userInfoString = await AsyncStorage.getItem('user');
      const accessToken = await AsyncStorage.getItem('access_token');
      if (!userInfoString) {
        console.error('No user data found in AsyncStorage');
        return;
      }

      if (!accessToken) {
        console.error('No access token found');
        return;
      }

      const userInfo = JSON.parse(userInfoString);
      console.log('Current user data:', userInfo);
      console.log('Access token at role selection page :', accessToken);

      // Update user with selected role
      const result = await updateUserRole({
        userId: userInfo.userID,
        role: role as UserTypeEnum,
      }).unwrap();
      // const result = await updateUserRole({
      //   body: {
      //     userID: userInfo.userID,
      //     email: userInfo.email,
      //     username: userInfo.username,
      //     role: role as UserTypeEnum,
      //     authProvider: userInfo.authProvider,
      //     active: true,
      //     token: accessToken,
      //   },
      // }).unwrap();

      console.log('==== Role update response ==== : ', result);

      if (result.success) {
        // Update stored user data with new role
        const updatedUser = { ...userInfo, role };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

        console.log('Role updated successfully, navigating to home');
        router.push('/');
      } else {
        console.error('Role update failed:', result.message);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Select Role',
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Select your role</Text>
        <RadioButton.Group onValueChange={(value) => setRole(value)} value={role}>
          <View style={styles.radioItem}>
            <RadioButton value="MERCHANT" />
            <Text>Merchant</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value="CUSTOMER" />
            <Text>Customer</Text>
          </View>
        </RadioButton.Group>
        <Button mode="contained" onPress={handleSubmit} disabled={!role} style={styles.button}>
          Continue
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  button: {
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
  },
});
