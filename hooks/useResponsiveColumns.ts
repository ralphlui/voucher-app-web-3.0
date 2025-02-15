import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const useResponsiveColumns = () => {
  const [numColumns, setNumColumns] = useState(1);

  const calculateNumColumns = () => {
    const screenWidth = Dimensions.get('window').width;
    if (screenWidth < 600) {
      setNumColumns(1); // Mobile
    } else if (screenWidth >= 600 && screenWidth < 1200) {
      setNumColumns(3); // Tablet
    } else {
      setNumColumns(6); // Web/large screens
    }
  };

  useEffect(() => {
    calculateNumColumns(); 
    const handleResize = () => {
      calculateNumColumns();
    };
    const subscription = Dimensions.addEventListener('change', handleResize); 
    return () => {
      subscription?.remove(); 
    };
  }, []);

  return numColumns;
};

export default useResponsiveColumns;
