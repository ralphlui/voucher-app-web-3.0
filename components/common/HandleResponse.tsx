import { useEffect } from 'react';
import Toast from 'react-native-toast-message';

export default function HandleResponse(props: any) {
  //? Porps
  const { isSuccess, isError, error, message, onSuccess, onError } = props;

  //? Re-Renders
  useEffect(() => {
    if (isSuccess) {
      if (onSuccess) onSuccess();
      Toast.show({
        type: 'success',
        text1: message,
      });
    }

    if (isError) {
      if (onError) onError();
      Toast.show({
        type: 'error',
        text1: error?.data?.message,
      });
    }
  }, []);

  return null;
}
