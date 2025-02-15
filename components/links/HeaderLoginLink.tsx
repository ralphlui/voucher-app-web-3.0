import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

const HeaderLoginLink = () => {
  return (
    <Link href="/login" style={styles.button}>
      Login
    </Link>
  );
};

const styles = StyleSheet.create({
  button: {
    alignContent: 'center',
    margin: 10,
    marginRight: 20,
  },
});

export default HeaderLoginLink;
