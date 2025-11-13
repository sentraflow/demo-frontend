import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Order, CreateOrderRequest, OrderStatus, PaymentStatus } from '@/types';

export const useOrders = (userId: number) => {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async (): Promise<Order[]> => {
      const response = await apiClient.get(`/api/orders/user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useOrder = (orderId: number, userId: number) => {
  return useQuery({
    queryKey: ['orders', orderId, userId],
    queryFn: async (): Promise<Order> => {
      const response = await apiClient.get(`/api/orders/${orderId}/user/${userId}`);
      return response.data;
    },
    enabled: !!orderId && !!userId,
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: async (): Promise<Order[]> => {
      const response = await apiClient.get('/api/orders');
      return response.data;
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: number;
      data: CreateOrderRequest;
    }): Promise<Order> => {
      const response = await apiClient.post(`/api/orders/user/${userId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['cart', variables.userId] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: number;
      status: OrderStatus;
    }): Promise<Order> => {
      const response = await apiClient.patch(
        `/api/orders/${orderId}/status?status=${status}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      paymentStatus,
    }: {
      orderId: number;
      paymentStatus: PaymentStatus;
    }): Promise<Order> => {
      const response = await apiClient.patch(
        `/api/orders/${orderId}/payment-status?paymentStatus=${paymentStatus}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      userId,
    }: {
      orderId: number;
      userId: number;
    }): Promise<void> => {
      await apiClient.delete(`/api/orders/${orderId}/user/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
