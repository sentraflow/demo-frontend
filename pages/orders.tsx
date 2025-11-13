import React from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { useOrders, useCancelOrder } from '@/hooks/use-orders';
import { useRouter } from 'next/router';
import { Order } from '@/types';

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { data: orders, isLoading } = useOrders(user?.id || 0);
  const cancelOrder = useCancelOrder();

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await cancelOrder.mutateAsync({ orderId, userId: user!.id });
      alert('Order cancelled successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to cancel order');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'text-yellow-600 bg-yellow-100',
      PROCESSING: 'text-blue-600 bg-blue-100',
      SHIPPED: 'text-purple-600 bg-purple-100',
      DELIVERED: 'text-green-600 bg-green-100',
      CANCELLED: 'text-red-600 bg-red-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'text-yellow-600',
      COMPLETED: 'text-green-600',
      FAILED: 'text-red-600',
      REFUNDED: 'text-blue-600',
    };
    return colors[status] || 'text-gray-600';
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                  <p
                    className={`text-sm mt-2 font-medium ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    Payment: {order.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Shipping Address:</span>{' '}
                  {order.shippingAddress}
                </p>

                <div className="space-y-2 mb-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">
                              No Image
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xl font-bold">
                    Total: ${order.totalAmount.toFixed(2)}
                  </div>
                  {order.orderStatus === 'PENDING' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelOrder(order.id)}
                      isLoading={cancelOrder.isPending}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
          <Button onClick={() => router.push('/products')}>
            Start Shopping
          </Button>
        </div>
      )}
    </Layout>
  );
}
