import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth-store';
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from '@/hooks/use-cart';
import { useCreateOrder } from '@/hooks/use-orders';
import { useRouter } from 'next/router';

export default function CartPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');

  const { data: cartItems, isLoading } = useCart(user?.id || 0);
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const createOrder = useCreateOrder();

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const handleUpdateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;

    try {
      await updateCartItem.mutateAsync({
        userId: user!.id,
        cartItemId,
        quantity,
      });
    } catch (error: any) {
      alert(error.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await removeFromCart.mutateAsync({
        userId: user!.id,
        cartItemId,
      });
    } catch (error: any) {
      alert(error.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;

    try {
      await clearCart.mutateAsync(user!.id);
    } catch (error: any) {
      alert(error.message || 'Failed to clear cart');
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      alert('Please enter a shipping address');
      return;
    }

    try {
      const orderItems = cartItems!.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await createOrder.mutateAsync({
        userId: user!.id,
        data: {
          shippingAddress,
          orderItems,
        },
      });

      setShowCheckout(false);
      alert('Order placed successfully!');
      router.push('/orders');
    } catch (error: any) {
      alert(error.message || 'Failed to create order');
    }
  };

  const total = cartItems?.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) || 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cartItems && cartItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        ${item.product.price.toFixed(2)} each
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2 py-1 border rounded"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 py-1 border rounded"
                          disabled={item.quantity >= item.product.stockQuantity}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="mt-2"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <Card>
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full mb-2"
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Button onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </div>
      )}

      <Modal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="Checkout"
      >
        <div className="space-y-4">
          <Input
            label="Shipping Address"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Enter your shipping address"
            required
          />
          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold mb-4">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full"
              isLoading={createOrder.isPending}
            >
              Place Order
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
