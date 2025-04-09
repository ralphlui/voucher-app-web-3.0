import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, RadioButton, Text } from 'react-native-paper';

import { useEditUserMutation } from '@/services/user.service';

export default function RoleSelection() {
  const [role, setRole] = useState('');
  const router = useRouter();
  const [editUser] = useEditUserMutation();

  const handleSubmit = async () => {
    try {
      // Get the stored Google user info
      const userInfoString = await AsyncStorage.getItem('googleUserInfo');
      if (!userInfoString) {
        console.error('No user info found');
        return;
      }

      const userInfo = JSON.parse(userInfoString);

      // Update user with selected role
      const result = await editUser({
        body: {
          email: userInfo.email,
          username: userInfo.name,
          role,
          googleId: userInfo.id,
          active: true,
          preferences: [], // Add any default preferences if needed
        },
      }).unwrap();

      console.log('=== User Update Response ===', result);

      if (result.success) {
        // Store user role
        await AsyncStorage.setItem('userRole', role);

        // Store complete user data if needed
        await AsyncStorage.setItem('userData', JSON.stringify(result.data));

        // Clean up Google info
        await AsyncStorage.removeItem('googleUserInfo');

        // Redirect to home page - the role check will happen there
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
