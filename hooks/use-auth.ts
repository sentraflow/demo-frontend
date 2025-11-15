import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

export const useRegister = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<AuthResponse> => {
      const response = await apiClient.post('/api/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
};

export const useLogin = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await apiClient.post('/api/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();

  return () => {
    logout();
  };
};
