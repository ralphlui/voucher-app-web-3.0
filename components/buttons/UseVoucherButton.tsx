import React, { useEffect } from 'react';
import { useConsumeVoucherMutation } from '@/services/voucher.service';
import HandleResponse from '@/components/common/HandleResponse';
import { Button } from 'react-native-paper';

type UseVoucherProps = {
  voucherId: string;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const UseVoucherButton = ({ voucherId, setVisible }: UseVoucherProps) => {
  const [consumeVoucher, { data, isSuccess, isError, isLoading, error }] =
    useConsumeVoucherMutation();

  useEffect(() => {
    if (isSuccess) {
      setVisible(false);
    }
  }, [isSuccess]);

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
      <Button loading={isLoading} mode="contained" onPress={() => consumeVoucher({ voucherId })}>
        Use
      </Button>
    </>
  );
};

export default UseVoucherButton;
