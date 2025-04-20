import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRefreshTokenMutation} from '@/services/user.service';
import { setAuthData } from '@/store/slices/auth.slice';
import { useAppDispatch } from '@/hooks/useRedux';

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
  const dispatch = useAppDispatch();

  const refreshTokenBeforeExpire = async () => {
    try {
      const tokenData = await getTokenFromStorage();
      if (!tokenData) {
        return;
      }
      const { accessToken, expiryTime } = tokenData;
      
      if (isTokenExpired(expiryTime)) {
        const refreshResponse = await refreshToken({}).unwrap(); 

        if (!refreshResponse.success) {
          throw new Error('Failed to refresh token');
        }

        console.log('Token refreshed successfully');
        const accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];

        if (accessToken) {
          await AsyncStorage.setItem('access_token', accessToken);
          const newExpiryTime = Date.now() + 15 * 60 * 1000; 
          dispatch(setAuthData({token: accessToken, success: true, expiryTime: newExpiryTime}));
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