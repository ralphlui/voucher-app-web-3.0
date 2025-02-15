import { useState } from 'react';

export default function usePagination() {
  const [pageNumber, setPageNumber] = useState(0); // Page start from 0
  const [pageSize, setPageSize] = useState(10);
  return {
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
  };
}
