import { RootState } from '@/store';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const needsBiometricVerification = useSelector((state: RootState) => state.auth.needsBiometricVerification);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || needsBiometricVerification) {
    return null;
  }

  return <>{children}</>;
};