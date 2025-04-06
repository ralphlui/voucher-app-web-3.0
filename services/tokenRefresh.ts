// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRefreshTokenMutation, useVerifyTokenMutation } from '@/services/user.service';

// const [refreshToken] = useRefreshTokenMutation();
// const [verifyToken] = useVerifyTokenMutation();

// // Function to check if the token is expired (to fix tmr)
// const isTokenExpired = (expiryTime: number) => {
//   const currentTime = Date.now();
//   return currentTime >= expiryTime - (2 * 60 * 1000); // Expiry time in milliseconds
// };

// // Function to retrieve the access token and expiry time from storage or cookies
// const getTokenFromStorage = async () => {
//   try {
//     const accessToken = await AsyncStorage.getItem('access_token');
//     const expiryTime = await AsyncStorage.getItem('accessTokenExpiry');
    
//     if (!accessToken || !expiryTime) {
//       console.error('No token or expiry time found');
//     }
//     // Return the token and expiry time
//     return { accessToken, expiryTime: parseInt(expiryTime, 10) };
//   } catch (error) {
//     console.error('Error retrieving token from storage', error);
//   }
// };

// // Function to refresh the access token
// const refreshTokenBeforeExpire = async () => {
//   try {
//     const tokenData = await getTokenFromStorage();
//     if (!tokenData) {
//       console.error('No token data available for refresh');
//       return;
//     }
//     const { accessToken, expiryTime } = tokenData;
//     if (isTokenExpired(expiryTime)) {
//       console.log('Token expired, refreshing...');
//       const refreshResponse = await refreshToken({}).unwrap(); 

//       if (!refreshResponse.ok) {
//         throw new Error('Failed to refresh token');
//       }

//       // API responds with a new access token and its expiry time in cookie
//       // retrieve its value, set in authorization header

//       // Store the new access token and its expiry time
//       await AsyncStorage.setItem('accessToken', newAccessToken);
//       await AsyncStorage.setItem('accessTokenExpiry', newExpiryTime);

//       console.log('Token refreshed successfully');

//       // Now you can make your API request with the valid access token
//       const response = await verifyToken({newAccessToken}).unwrap();
//       console.log('Token validated successfully');
//       return response;
//     } else {
//       console.log('Token is still valid');
//     }
//   } catch (error) {
//     console.error('Error refreshing token:', error);
//   }
// };
