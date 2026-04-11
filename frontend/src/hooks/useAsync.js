import { useState, useCallback } from 'react';

export function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setData(null);
    setError(null);
    
    try {
      const response = await asyncFunction(...args);
      setData(response.data?.data || response.data);
      setStatus('success');
      return response.data?.data || response.data;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
  };
}
