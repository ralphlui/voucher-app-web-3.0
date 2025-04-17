import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRefreshTokenMutation} from '@/services/user.service';
import { setAuthData } from '@/store/slices/auth.slice';
import { useAppDispatch } from '@/hooks/useRedux';

const dispatch = useAppDispatch();

// Function to check if the token is expired
const isTokenExpired = (expiryTime: string | null) => {
  if (!expiryTime) return true;
  return Date.now() >= parseInt(expiryTime, 10) - (2 * 60 * 1000); // Expiry time in milliseconds
};

// Function to retrieve the access token and expiry time from storage or cookies
const getTokenFromStorage = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    const expiryTime = await AsyncStorage.getItem('accessTokenExpiry');
    console.log('Access token:', accessToken);
    console.log('Expiry time:', expiryTime);
    
    if (!accessToken || !expiryTime) {
      console.error('No token or expiry time found');
      return;
    }
    return { accessToken, expiryTime };
  } catch (error) {
    console.error('Error retrieving token from storage', error);
  }
};

const useTokenRefresh = () => {
  const [refreshToken, { isLoading: tokenLoading, isSuccess: tokenSuccess, isError: tokenError }] = useRefreshTokenMutation(); 

  // Function to refresh the access token
  const refreshTokenBeforeExpire = async () => {
    try {
      console.log('Checking token expiry...');
      const tokenData = await getTokenFromStorage();
      if (!tokenData) {
        console.error('No token data available for refresh');
        return;
      }
      const { accessToken, expiryTime } = tokenData;
      
      if (isTokenExpired(expiryTime)) {
        const refreshResponse = await refreshToken({}).unwrap(); 
        console.log('Refresh response:', refreshResponse);

        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh token');
        }

        console.log('Token refreshed successfully');

        // Store the new access token and its expiry time
        // const accessToken = 'tokennn';
        const accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];

        if (accessToken) {
          console.log('New access token:   ', accessToken);
          await AsyncStorage.setItem('access_token', accessToken);
          const newExpiryTime = Date.now() + 15 * 60 * 1000; 
          console.log('New expiry time:', newExpiryTime);
          dispatch(setAuthData({token: accessToken, success: true, expiryTime: newExpiryTime}));
          // headers.set();
        }
        else {
          throw new Error('Access token not found in cookies');
        }
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };
  return { refreshTokenBeforeExpire, tokenLoading, tokenSuccess, tokenError };
}

export default useTokenRefresh;