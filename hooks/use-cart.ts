import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { CartItem, AddToCartRequest } from '@/types';

export const useCart = (userId: number) => {
  return useQuery({
    queryKey: ['cart', userId],
    queryFn: async (): Promise<CartItem[]> => {
      const response = await apiClient.get(`/api/cart/user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: number;
      data: AddToCartRequest;
    }): Promise<CartItem> => {
      const response = await apiClient.post(`/api/cart/user/${userId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.userId] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      cartItemId,
      quantity,
    }: {
      userId: number;
      cartItemId: number;
      quantity: number;
    }): Promise<CartItem> => {
      const response = await apiClient.put(
        `/api/cart/user/${userId}/items/${cartItemId}?quantity=${quantity}`
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.userId] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      cartItemId,
    }: {
      userId: number;
      cartItemId: number;
    }): Promise<void> => {
      await apiClient.delete(`/api/cart/user/${userId}/items/${cartItemId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.userId] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number): Promise<void> => {
      await apiClient.delete(`/api/cart/user/${userId}`);
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    },
  });
};
