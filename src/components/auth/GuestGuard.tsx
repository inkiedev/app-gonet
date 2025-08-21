import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'expo-router';
import { RootState } from '@/store';

interface GuestGuardProps {
  children: React.ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <>{children}</>;
};