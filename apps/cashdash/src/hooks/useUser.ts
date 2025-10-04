import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUser } from '@/store/api/userEndPoints';
import { useCallback } from 'react';
import type { RootState } from '@/store/store';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector(
    (state: RootState) => state.user
  );

  const getUser = () =>
    useCallback(() => {
      dispatch(fetchUser());
    }, [dispatch]);

  return { user, loading, error, getUser };
};
