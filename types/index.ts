// Import shared types from common package
export { User, Product, Order, PaginatedResponse } from '@sentraflow-demo/shared-types';

// User Types - extend/augment if needed

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Product Types - request types
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imageUrl?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  available?: boolean;
}

// Cart Types
export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

// Order Types - re-export enums and request types
export type { OrderStatus, PaymentStatus, OrderItem, CartItem } from '@sentraflow-demo/shared-types';

export interface CreateOrderRequest {
  shippingAddress: string;
  orderItems: {
    productId: number;
    quantity: number;
  }[];
}

// API Response Types
export interface ApiError {
  message: string;
  status: number;
}
