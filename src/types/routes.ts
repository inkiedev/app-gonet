// Protected routes type definitions
export type ProtectedRoutes = 
  | '/(protected)/home/'
  | '/(protected)/home/perfil'
  | '/(protected)/home/ajustes'
  | '/(protected)/home/servicios'
  | '/(protected)/home/planes'
  | '/(protected)/home/pagos'
  | '/(protected)/home/soporte'
  | '/(protected)/home/calificanos'
  | '/(protected)/home/goclub'
  | '/(protected)/home/promociones'
  | '/(protected)/home/agencias';

export type PublicRoutes =
  | '/'
  | '/(auth)/login'
  | '/(auth)/register'
  | '/(auth)/contact-form';

export type AppRoutes = ProtectedRoutes | PublicRoutes;