import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Product, CreateProductRequest, UpdateProductRequest } from '@/types';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const response = await apiClient.get('/api/products');
      return response.data;
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async (): Promise<Product> => {
      const response = await apiClient.get(`/api/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async (): Promise<Product[]> => {
      const response = await apiClient.get(`/api/products/category/${category}`);
      return response.data;
    },
    enabled: !!category,
  });
};

export const useAvailableProducts = () => {
  return useQuery({
    queryKey: ['products', 'available'],
    queryFn: async (): Promise<Product[]> => {
      const response = await apiClient.get('/api/products/available');
      return response.data;
    },
  });
};

export const useSearchProducts = (keyword: string) => {
  return useQuery({
    queryKey: ['products', 'search', keyword],
    queryFn: async (): Promise<Product[]> => {
      const response = await apiClient.get(`/api/products/search?keyword=${keyword}`);
      return response.data;
    },
    enabled: keyword.length > 0,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductRequest): Promise<Product> => {
      const response = await apiClient.post('/api/products', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateProductRequest;
    }): Promise<Product> => {
      const response = await apiClient.put(`/api/products/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await apiClient.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
