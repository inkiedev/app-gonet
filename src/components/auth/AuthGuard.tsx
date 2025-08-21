import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'expo-router';
import { RootState } from '@/store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <>{children}</>;
};