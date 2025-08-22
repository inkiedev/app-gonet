import { RootState } from '@/store';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

interface AuthGuestProps {
  children: React.ReactNode;
}

export const AuthGuest: React.FC<AuthGuestProps> = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const needsBiometricVerification = useSelector((state: RootState) => state.auth.needsBiometricVerification);

  useEffect(() => {
    if (isAuthenticated && !needsBiometricVerification) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, needsBiometricVerification, router]);

  if (isAuthenticated && !needsBiometricVerification) {
    return null;
  }

  return <>{children}</>;
};